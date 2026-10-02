import { CaptionedAudio } from '../../common/audio/CaptionedAudio';
import { CaptionBlock } from '../../common/captions/CaptionBlock';
import { CaptionUtils } from '../../common/captions/CaptionUtils';

export class BasicQuizCaptionsProcessor {
	static processCaptions(captionedAudios: CaptionedAudio[]): CaptionBlock[] {
		return captionedAudios
			.map((audio) => {
				return CaptionUtils.joinCaptionsInThirds(
					audio.captions.filter((caption) => Boolean(caption.text)),
				);
			})
			.flat();
	}
}
