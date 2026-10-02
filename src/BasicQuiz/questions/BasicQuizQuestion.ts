import { CaptionedAudio } from '../../common/audio/CaptionedAudio';

export type BasicQuizQuestion = {
	answer: string;
	audios: CaptionedAudio[];
	bgUrl?: string;
};

export type BasicQuizQuestionWithTime = {
	startInSeconds: number;
	durationInSeconds: number;
	audios:
		| [CaptionedAudio, CaptionedAudio]
		| [CaptionedAudio, CaptionedAudio, CaptionedAudio];
	bgUrl?: string;
	bgDurationInSeconds?: number;
	answer: string;
	answerInSeconds: number;
	commentStartInSeconds?: number;
};
