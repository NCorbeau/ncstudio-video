import {
	AbsoluteFill,
	Img,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import { Video } from '../../common/video/Video';

type RankingImageWithEffectProps = {
	video: Video;
};

export const RankingImageWithEffect: React.FC<RankingImageWithEffectProps> = ({
	video,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const imageUrl = video.videoUrl.match(/:(.*?)\]$/)?.[1] ?? '';
	const effect = video.videoUrl.match(/^\[(.*?):/)?.[1] ?? '';

	const stylesByEffect: Record<string, { scale: number }> = {
		'zoom-in': {
			scale: interpolate(frame, [0, video.durationInSeconds * fps], [1, 1.3], {
				extrapolateRight: 'clamp',
			}),
		},
		'zoom-out': {
			scale: interpolate(frame, [0, video.durationInSeconds * fps], [1.3, 1], {
				extrapolateRight: 'clamp',
			}),
		},
	};

	if (!imageUrl || !stylesByEffect[effect]) {
		return null;
	}

	return (
		<AbsoluteFill
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Img
				src={imageUrl}
				style={{
					position: 'absolute',
					transform: `scale(${stylesByEffect[effect].scale})`,
					width: video.size.width,
					height: video.size.height,
					left: video.position.x,
					top: video.position.y,
				}}
			/>
		</AbsoluteFill>
	);
};
