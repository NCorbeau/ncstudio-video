import { AbsoluteFill } from 'remotion';
import { CaptionedAudio } from '../common/audio/CaptionedAudio';
import { RankingCaptionsProcessor } from './captions/RankingCaptionsProcessor';
import {
	RankingCaptionContainer,
	RankingCaptionsTop,
} from './captions/RankingCaptionContainer';
import { RankingAudio } from './audio/RankingAudio';
import { Video } from '../common/video/Video';
import { RankingVideoContainer } from './video/RankingVideoContainer';

export type RankingInterludeInput = {
	audio: CaptionedAudio;
	bgUrl?: string;
	videos: Video[];
	type: 'intro' | 'outro';
};

/** Standalone interlude; offsets come from its supplied audio and videos. */
export const RankingInterlude: React.FC<{
	readonly interlude: RankingInterludeInput;
}> = ({ interlude }) => {
	const topic = {
		name: interlude.type,
		audio: interlude.audio,
		shots: [{ videos: interlude.videos }],
	};
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{ top: RankingCaptionsTop }}>
				<RankingCaptionContainer
					captionBlocks={RankingCaptionsProcessor.processCaptions([
						interlude.audio,
					])}
				/>
			</AbsoluteFill>
			<RankingAudio audio={interlude.audio} />
			<RankingVideoContainer
				videosWithTopic={interlude.videos.map((video) => ({ video, topic }))}
			/>
		</AbsoluteFill>
	);
};
