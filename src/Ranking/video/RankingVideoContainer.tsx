import {
	AbsoluteFill,
	OffthreadVideo,
	Sequence,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import { RankingImageWithEffect } from './RankingImageWithEffect';
import { RankingTopic } from '../topics/RankingTopics';
import { Video } from '../../common/video/Video';

export type VideoWithTopic = { video: Video; topic: RankingTopic };
type RankingVideoContainerProps = {
	readonly videosWithTopic: VideoWithTopic[];
};

const TimedRankingVideo: React.FC<{
	readonly video: Video;
	readonly wipeIn: boolean;
}> = ({ video, wipeIn }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const duration = Math.ceil(video.durationInSeconds * fps);
	const transitionFrames = Math.min(20, Math.floor(duration / 2));
	const enter = interpolate(frame, [0, transitionFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const exit = interpolate(
		frame,
		[duration - transitionFrames, duration],
		[1, 0],
		{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
	);
	return (
		<AbsoluteFill
			style={{
				opacity: wipeIn ? exit : Math.min(enter, exit),
				clipPath: wipeIn ? `inset(0 ${(1 - enter) * 100}% 0 0)` : undefined,
			}}
		>
			{video.videoUrl.startsWith('[') && video.videoUrl.endsWith(']') ? (
				<RankingImageWithEffect video={video} />
			) : (
				<OffthreadVideo
					pauseWhenBuffering
					src={video.videoUrl}
					muted={video.muted}
					style={{
						position: 'absolute',
						width: video.size.width,
						height: video.size.height,
						left: video.position.x,
						top: video.position.y,
						filter:
							video.brightness !== undefined
								? `brightness(${video.brightness}%)`
								: undefined,
					}}
				/>
			)}
		</AbsoluteFill>
	);
};

/** Each clip keeps its timeline offset; simultaneous videos share a shot. */
export const RankingVideoContainer: React.FC<RankingVideoContainerProps> = ({
	videosWithTopic,
}) => {
	const { fps } = useVideoConfig();
	return (
		<AbsoluteFill>
			{videosWithTopic.map(({ video, topic }, index) => (
				<Sequence
					key={index}
					from={Math.round(video.startInSeconds * fps)}
					durationInFrames={Math.ceil(video.durationInSeconds * fps)}
				>
					<TimedRankingVideo
						video={video}
						wipeIn={index > 0 && videosWithTopic[index - 1].topic !== topic}
					/>
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
