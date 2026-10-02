import {
	AbsoluteFill,
	Sequence,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import { BackgroundWithTime } from '../../common/background/BackgroundWithTime';
import { RankingBackground } from './RankingBackground';

type RankingBackgroundContainerProps = {
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
			<RankingBackground bgUrl={bgUrl} />
		</AbsoluteFill>
	);
};

export const RankingBackgroundContainer: React.FC<
	RankingBackgroundContainerProps
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
