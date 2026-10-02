import { Sequence, useVideoConfig, Audio } from 'remotion';
import { CaptionedAudio } from '../../common/audio/CaptionedAudio';

type RankingAudioProps = {
	audio: CaptionedAudio;
};

export const RankingAudio: React.FC<RankingAudioProps> = ({ audio }) => {
	const { fps } = useVideoConfig();

	return (
		<Sequence
			name="Audio"
			from={Math.round((audio.startInSeconds ?? 0) * fps)}
			durationInFrames={Math.ceil(audio.durationInSeconds * fps)}
		>
			<Audio src={audio.audioUrl} />
		</Sequence>
	);
};
