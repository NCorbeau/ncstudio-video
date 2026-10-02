import { useVideoConfig, AbsoluteFill } from 'remotion';
import { CaptionedAudio } from '../common/audio/CaptionedAudio';
import { RankingAudio } from './audio/RankingAudio';
import { RankingTextOverlay } from './overlay/RankingTextOverlay';
import { CuriosaLogo } from '../channel/Curiosa/CuriosaLogo';
import { RankingSummary } from './RankingSummary';

type RankingCuriosaClosingProps = {
	start: number;
	duration: number;
	audio: CaptionedAudio;
	text?: string;
};

const textBeforeSummaryDurationInSeconds = 3.5;
const logoTop = 950;
const summaryTop = 200;
const textTop = 400;

export const RankingCuriosaClosing: React.FC<RankingCuriosaClosingProps> = ({
	start,
	duration,
	audio,
	text,
}) => {
	const { fps } = useVideoConfig();

	return (
		<AbsoluteFill>
			<RankingAudio audio={audio} />
			<CuriosaLogo
				from={start * fps}
				direction="out"
				top={logoTop}
				duration={duration}
				timing={{
					hexagonDelay: 0,
					hexagonDuration: duration * fps,
					logoDelay: 0,
					logoDuration: duration * fps,
				}}
			/>
			<RankingSummary
				duration={{
					start: (start + textBeforeSummaryDurationInSeconds) * fps,
					end: (start + duration) * fps,
				}}
				top={summaryTop}
			/>
			<RankingTextOverlay
				duration={{
					start: start * fps,
					end: (start + textBeforeSummaryDurationInSeconds) * fps,
				}}
				text={text}
				top={textTop}
			/>
		</AbsoluteFill>
	);
};
