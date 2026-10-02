import {
	AbsoluteFill,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import { ProgressBar } from './ProgressBar';

export type BasicQuizBar = {
	startInSeconds: number;
	durationInSeconds: number;
};

export type BasicQuizProgressBarProps = {
	bars: BasicQuizBar[];
};

export const BasicQuizProgressBar: React.FC<BasicQuizProgressBarProps> = ({
	bars,
}) => {
	const { fps } = useVideoConfig();
	const frame = useCurrentFrame();

	const getProgress = (startFrame: number, durationInFrames: number) => {
		const progress = 0 + ((frame - startFrame) / Math.max(1, durationInFrames - 10)) * 100;
		return Math.max(1, Math.min(100, progress));
	};

	return (
		<AbsoluteFill style={{ marginTop: -30 }}>
			{bars.map((bar, index) => {
				const nextBar = bars[index + 1] ?? null;
				const barStartFrame = Math.round(bar.startInSeconds * fps);
				const barEndFrame = Math.min(
					nextBar ? Math.round(nextBar.startInSeconds * fps) : Infinity,
					barStartFrame + Math.ceil(bar.durationInSeconds * fps),
				);
				const durationInFrames = barEndFrame - barStartFrame;
				if (durationInFrames <= 0) {
					return null;
				}

				return (
					<Sequence
						key={index}
						name="Progress Bar"
						from={barStartFrame}
						durationInFrames={durationInFrames}
					>
						<AbsoluteFill
							style={{
								height: 250,
								display: 'flex',
								justifyItems: 'center',
								alignItems: 'center',
								padding: '0 160px',
							}}
						>
							<ProgressBar
								progress={getProgress(barStartFrame, durationInFrames)}
							/>
						</AbsoluteFill>
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};
