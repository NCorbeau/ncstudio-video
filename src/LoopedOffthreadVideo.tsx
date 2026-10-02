import { Loop, OffthreadVideo, useVideoConfig } from 'remotion';

export const LoopedOffthreadVideo: React.FC<{
	durationInSeconds: number | null;
	src: string;
	onVideoFrame?: (frame: CanvasImageSource) => void;
	style?: React.CSSProperties;
	muted?: boolean;
}> = ({ durationInSeconds, src, style, muted, onVideoFrame }) => {
	const { fps } = useVideoConfig();

	if (
		durationInSeconds === null ||
		!Number.isFinite(durationInSeconds) ||
		durationInSeconds <= 0
	) {
		return null;
	}

	return (
		<Loop durationInFrames={Math.max(1, Math.round(fps * durationInSeconds))}>
			<OffthreadVideo
				pauseWhenBuffering
				src={src}
				style={style}
				muted={muted}
				onVideoFrame={onVideoFrame}
			/>
		</Loop>
	);
};
