import { Caption } from '../captions/Caption';
import { Duration } from '../types/Duration';

export type CaptionedAudio = {
	audioUrl: string;
	/** Timeline offset of the whole clip; caption timestamps may start later. */
	startInSeconds?: number;
	durationInSeconds: number;
	captions: Caption[];
};

export class CaptionedAudioUtils {
	static getAudioDuration(audio: CaptionedAudio, fps: number): Duration {
		const start = audio.startInSeconds ?? 0;
		return {
			start: Math.round(start * fps),
			end: Math.ceil((start + audio.durationInSeconds) * fps),
		};
	}
}
