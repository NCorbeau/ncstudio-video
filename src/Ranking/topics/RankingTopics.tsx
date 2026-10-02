import { AbsoluteFill, useVideoConfig } from 'remotion';
import { useContext } from 'react';
import { CaptionedAudio } from '../../common/audio/CaptionedAudio';
import { Video } from '../../common/video/Video';
import { RankingTopicContainer } from './RankingTopicContainer';
import { RankingContext } from '../RankingContext';
import { RankingVideoContainer } from '../video/RankingVideoContainer';
import { Animated, Fade } from 'remotion-animated';
import { RankingTimeline } from '../RankingTimeline';
import { CuriosaCornerLogo } from '../../channel/Curiosa/CuriosaCornerLogo';

export type RankingTopic = {
	name: string;
	shots: RankingShot[];
	audio: CaptionedAudio;
	number?: number;
	text?: string;
	references?: string;
	bgUrl?: string;
};

export type RankingShot = {
	videos: Video[];
};

export type RankingTopicsProps = {
	topics: RankingTopic[];
};

export const RankingTopics: React.FC<RankingTopicsProps> = ({ topics }) => {
	const { timeline } = useContext(RankingContext);

	const { fps } = useVideoConfig();

	if (!timeline) return null;
	const videosWithTopic = topics.flatMap((topic) =>
		topic.shots.flatMap((_shot, index) =>
			timeline
				.getShotVideosWithAdjustedTime(topic, index)
				.map((video) => ({ video, topic })),
		),
	);

	return (
		<AbsoluteFill>
			<Animated
				animations={[
					Fade({
						initial: 0,
						start: RankingTimeline.INTRO_DURATION * fps,
						duration: 50,
						to: 1,
					}),
					Fade({
						initial: 1,
						start:
							(timeline.getTotalDurationInSeconds() -
								timeline.getClosingDuration()) *
								fps -
							50,
						duration: 50,
						to: 0,
					}),
				]}
			>
				<RankingVideoContainer videosWithTopic={videosWithTopic} />
				{topics.map((topic, index) => (
					<RankingTopicContainer key={index} topic={topic} />
				))}
				<CuriosaCornerLogo />
			</Animated>
		</AbsoluteFill>
	);
};
