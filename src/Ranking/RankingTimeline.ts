import {
	CaptionedAudio,
	CaptionedAudioUtils,
} from '../common/audio/CaptionedAudio';
import { CaptionBlock } from '../common/captions/CaptionBlock';
import { Video } from '../common/video/Video';
import { RankingCaptionsProcessor } from './captions/RankingCaptionsProcessor';
import { RankingTextOverlayProps } from './overlay/RankingTextOverlay';
import type { RankingClosing } from './Ranking';
import type { RankingShot, RankingTopic } from './topics/RankingTopics';

type RankingTimelineSequence = {
	startInSeconds: number;
	durationInSeconds?: number;
	type: 'intro' | 'topic' | 'outro';
	audio?: CaptionedAudio;
	topic?: RankingTopic;
	bgUrl?: string;
};

export class RankingTimeline {
	public static readonly INTRO_DURATION = 2;

	private static readonly GAP_BETWEEN_TOPICS = 1.5;
	private static readonly CLOSING_ADDITIONAL_DURATION = 8;

	private readonly audioSequences: RankingTimelineSequence[] = [];
	private readonly backgroundSequences: RankingTimelineSequence[] = [];
	private readonly shotVideos = new Map<RankingTopic, Video[][]>();

	private totalDurationInSeconds = 0;

	constructor(topics: RankingTopic[], closing: RankingClosing) {
		this.buildTimeline(topics, closing);
	}

	getTopicAudioWithAdjustedTime(topic: RankingTopic): CaptionedAudio {
		const topicStartTime = this.audioSequences.find(
			(seq) => seq.type === 'topic' && seq.topic === topic,
		)!.startInSeconds;
		return this.addTimeToAudio(topic.audio, topicStartTime);
	}

	getClosingAudioWithAdjustedTime(): CaptionedAudio {
		const closingStartTime = this.audioSequences.find(
			(seq) => seq.type === 'outro',
		)!.startInSeconds;
		return this.addTimeToAudio(
			this.audioSequences.find((seq) => seq.type === 'outro')!.audio!,
			closingStartTime,
		);
	}

	getShotVideosWithAdjustedTime(
		topic: RankingTopic,
		shotIndex: number,
	): Video[] {
		const videos = this.shotVideos.get(topic)?.[shotIndex];
		if (!videos) throw new Error('Shot is not part of this ranking timeline');
		return videos.map((video) => ({ ...video }));
	}

	getShotWithAdjustedTime(topic: RankingTopic, shotIndex: number): RankingShot {
		return {
			videos: this.getShotVideosWithAdjustedTime(topic, shotIndex),
		};
	}

	getTotalDurationInSeconds(): number {
		return this.totalDurationInSeconds;
	}

	getBackgroundSequences(): RankingTimelineSequence[] {
		return this.backgroundSequences;
	}

	getClosingDuration(): number {
		return (
			this.audioSequences.find((seq) => seq.type === 'outro')!
				.durationInSeconds! + RankingTimeline.CLOSING_ADDITIONAL_DURATION
		);
	}

	getCaptionSequences(topics: RankingTopic[]): CaptionBlock[] {
		const allAudios = [
			...topics.map((topic) => this.getTopicAudioWithAdjustedTime(topic)),
			this.getClosingAudioWithAdjustedTime(),
		];
		return RankingCaptionsProcessor.processCaptions(allAudios);
	}

	getTextOverlays(
		topics: RankingTopic[],
		fps: number,
	): RankingTextOverlayProps[] {
		return topics.map((topic, index) => {
			const audio = this.getTopicAudioWithAdjustedTime(topic);
			const audioDuration = CaptionedAudioUtils.getAudioDuration(audio, fps);
			const duration =
				index === 0 ? { start: 0, end: audioDuration.end } : audioDuration;

			return {
				duration,
				top: 500,
				text: topic.text,
				title: topic.name,
				number: topic.number,
				references: topic.references,
			};
		});
	}

	private buildTimeline(topics: RankingTopic[], closing: RankingClosing): void {
		let currentTime = 0;

		currentTime += RankingTimeline.INTRO_DURATION;

		topics.forEach((topic) => {
			currentTime =
				this.buildTopicTimeline(topic, currentTime) +
				RankingTimeline.GAP_BETWEEN_TOPICS;
		});

		currentTime = this.buildClosingTimeline(closing, currentTime);

		this.totalDurationInSeconds = currentTime;
	}

	private buildTopicTimeline(topic: RankingTopic, currentTime: number): number {
		const topicStart = currentTime;

		this.audioSequences.push({
			startInSeconds: currentTime,
			durationInSeconds: topic.audio.durationInSeconds,
			type: 'topic',
			topic,
			audio: topic.audio,
		});

		const shotDuration = topic.shots.reduce(
			(total, shot) => total + this.getTotalVideoDuration(shot.videos),
			0,
		);
		const topicDuration = Math.max(topic.audio.durationInSeconds, shotDuration);
		let shotOffset = 0;
		const adjustedShots = topic.shots.map((shot, shotIndex) => {
			const adjusted = shot.videos.map((video) => ({
				...video,
				startInSeconds: topicStart + shotOffset + video.startInSeconds,
				durationInSeconds:
					shotIndex === topic.shots.length - 1
						? Math.max(
								video.durationInSeconds,
								topicDuration - shotOffset - video.startInSeconds,
							) + RankingTimeline.GAP_BETWEEN_TOPICS
						: video.durationInSeconds,
			}));
			shotOffset += this.getTotalVideoDuration(shot.videos);
			return adjusted;
		});
		this.shotVideos.set(topic, adjustedShots);
		currentTime = topicStart + topicDuration;

		if (topic.bgUrl) {
			this.backgroundSequences.push({
				startInSeconds: topicStart,
				durationInSeconds:
					currentTime - topicStart + RankingTimeline.GAP_BETWEEN_TOPICS,
				type: 'topic',
				bgUrl: topic.bgUrl,
				topic,
			});
		}

		return currentTime;
	}

	private buildClosingTimeline(
		closing: RankingClosing,
		currentTime: number,
	): number {
		const closingStart = currentTime;

		this.audioSequences.push({
			startInSeconds: currentTime,
			durationInSeconds: closing.audio.durationInSeconds,
			type: 'outro',
			audio: closing.audio,
		});

		if (closing.audio.durationInSeconds > currentTime - closingStart) {
			currentTime +=
				closing.audio.durationInSeconds - (currentTime - closingStart);
		}

		currentTime += RankingTimeline.CLOSING_ADDITIONAL_DURATION;

		return currentTime;
	}

	private addTimeToAudio(
		audio: CaptionedAudio,
		startInSeconds: number,
	): CaptionedAudio {
		return {
			audioUrl: audio.audioUrl,
			startInSeconds,
			durationInSeconds: audio.durationInSeconds,
			captions: audio.captions.map((caption) => {
				return {
					startInSeconds: caption.startInSeconds + startInSeconds,
					endInSeconds: caption.endInSeconds + startInSeconds,
					text: caption.text,
				};
			}),
		};
	}

	private getTotalVideoDuration(videos: Video[]): number {
		return videos.reduce((maxDuration, video) => {
			const duration = video.startInSeconds + video.durationInSeconds;
			return duration > maxDuration ? duration : maxDuration;
		}, 0);
	}
}
