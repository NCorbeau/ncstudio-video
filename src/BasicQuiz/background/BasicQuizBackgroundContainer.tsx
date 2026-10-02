import {
	AbsoluteFill,
	Sequence,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import { BackgroundWithTime } from '../../common/background/BackgroundWithTime';
import { BasicQuizBackground } from './BasicQuizBackground';

type BasicQuizBackgroundContainerProps = {
	readonly backgrounds: BackgroundWithTime[];
};
const FadingBackground: React.FC<{ readonly bgUrl: string }> = ({ bgUrl }) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill
			style={{
				opacity: interpolate(frame, [0, 20], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				}),
			}}
		>
			<BasicQuizBackground bgUrl={bgUrl} />
		</AbsoluteFill>
	);
};

export const BasicQuizBackgroundContainer: React.FC<
	BasicQuizBackgroundContainerProps
> = ({ backgrounds }) => {
	const { fps } = useVideoConfig();
	return (
		<AbsoluteFill>
			{backgrounds.map((background, index) => (
				<Sequence
					key={index}
					from={Math.round(background.bgStartInSeconds * fps)}
					durationInFrames={
						Math.ceil((background.bgDurationInSeconds ?? 60) * fps) + 20
					}
				>
					<FadingBackground bgUrl={background.bgUrl} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
