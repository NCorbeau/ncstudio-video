import { getVideoMetadata } from '@remotion/media-utils';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
	delayRender,
	continueRender,
	useVideoConfig,
	AbsoluteFill,
	cancelRender,
} from 'remotion';
import { LoopedOffthreadVideo } from '../../LoopedOffthreadVideo';

type RankingBackgroundProps = {
	bgUrl?: string;
};

export const RankingBackground: React.FC<RankingBackgroundProps> = ({
	bgUrl,
}) => {
	const [bgDurationInSeconds, setBgDurationInSeconds] = useState<number | null>(
		null,
	);
	const [handle] = useState(() => delayRender());

	useEffect(() => {
		if (!bgUrl) {
			continueRender(handle);
			return;
		}

		getVideoMetadata(bgUrl)
			.then((metadata) => {
				setBgDurationInSeconds(metadata.durationInSeconds);
				continueRender(handle);
			})
			.catch(cancelRender);
	}, [bgUrl, handle]);

	const canvas = useRef<HTMLCanvasElement>(null);
	const { width, height } = useVideoConfig();

	const onVideoFrame = useCallback(
		(frame: CanvasImageSource) => {
			if (!canvas.current) {
				return;
			}
			const context = canvas.current.getContext('2d');

			if (!context) {
				return;
			}

			context.filter = 'brightness(50%)';
			context.drawImage(frame, 0, 0, width, height);
		},
		[height, width],
	);

	if (!bgUrl) {
		return null;
	}

	return (
		<AbsoluteFill>
			<AbsoluteFill>
				<LoopedOffthreadVideo
					muted
					durationInSeconds={bgDurationInSeconds}
					style={{ opacity: 0 }}
					src={bgUrl!}
					onVideoFrame={onVideoFrame}
				/>
			</AbsoluteFill>
			<AbsoluteFill>
				<canvas ref={canvas} width={width} height={height} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
