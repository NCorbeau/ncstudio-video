import { Caption } from './Caption';
import { CaptionBlock } from './CaptionBlock';

export class CaptionUtils {
	static joinCaptionsInPairs(captions: Caption[]): CaptionBlock[] {
		const joinedCaptions: CaptionBlock[] = [];
		for (let i = 0; i < captions.length; i += 2) {
			const firstCaption = captions[i];
			const secondCaption = captions[i + 1];
			if (!secondCaption) {
				joinedCaptions.push({
					startInSeconds: firstCaption.startInSeconds,
					endInSeconds: firstCaption.endInSeconds,
					captions: [firstCaption],
				});
			} else {
				joinedCaptions.push({
					startInSeconds: firstCaption.startInSeconds,
					endInSeconds: secondCaption.endInSeconds,
					captions: [firstCaption, secondCaption],
				});
			}
		}
		return joinedCaptions;
	}

	static joinCaptionsInThirds(captions: Caption[]): CaptionBlock[] {
		const joinedCaptions: CaptionBlock[] = [];
		for (let i = 0; i < captions.length; ) {
			const firstCaption = captions[i];
			const secondCaption = captions[i + 1];
			const thirdCaption = captions[i + 2];

			if (!firstCaption || this.isCaptionBreak(firstCaption)) {
				i++;
			} else if (!secondCaption || this.isCaptionBreak(secondCaption)) {
				joinedCaptions.push({
					startInSeconds: firstCaption.startInSeconds,
					endInSeconds: firstCaption.endInSeconds,
					captions: [firstCaption],
				});
				i += 2;
			} else if (!thirdCaption || this.isCaptionBreak(thirdCaption)) {
				joinedCaptions.push({
					startInSeconds: firstCaption.startInSeconds,
					endInSeconds: secondCaption.endInSeconds,
					captions: [firstCaption, secondCaption],
				});
				i += 3;
			} else {
				joinedCaptions.push({
					startInSeconds: firstCaption.startInSeconds,
					endInSeconds: thirdCaption.endInSeconds,
					captions: [firstCaption, secondCaption, thirdCaption],
				});
				i += 3;
			}
		}
		return joinedCaptions;
	}

	static processCaption(caption: Caption): Caption {
		return {
			startInSeconds: caption.startInSeconds,
			endInSeconds: caption.endInSeconds,
			text: caption.text
				.replace('.', '')
				.replace('(', '')
				.replace(')', '')
				.replace('—', '-')
				.replace('–', '-')
				.replace('“', '"')
				.replace('”', '"')
				.replace('’', "'")
				.replace('‘', "'"),
		};
	}

	private static isCaptionBreak(caption: Caption): boolean {
		return caption.text === '[break]';
	}
}
