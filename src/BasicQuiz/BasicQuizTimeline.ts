import { CaptionedAudio } from '../common/audio/CaptionedAudio';
import {
	BasicQuizQuestion,
	BasicQuizQuestionWithTime,
} from './questions/BasicQuizQuestion';

export type BasicQuizTimelineSequence = {
	startInSeconds: number;
	durationInSeconds?: number;
	type: 'question' | 'answer' | 'comment' | 'intro' | 'outro' | 'filler';
	question?: BasicQuizQuestion;
	bgUrl?: string;
};

export type BasicQuizBackgrounds = {
	introBgUrl?: string;
	outroBgUrl?: string;
	bgUrls?: string[];
};

export class BasicQuizTimeline {
	static readonly minTimeForAnswer = 0.7;
	static readonly maxTimeForAnswer = 2;
	static readonly videoDuration = 60;

	audioSequences: BasicQuizTimelineSequence[] = [];
	captionSequences: BasicQuizTimelineSequence[] = [];
	progressBarSequences: BasicQuizTimelineSequence[] = [];
	backgroundSequences: BasicQuizTimelineSequence[] = [];

	private static readonly gapBetweenQuestions = 0.5;
	private static readonly gapBeforeAnswer = 0.5;

	private timeForOneAnswer = 0;
	private totalDurationInSeconds = 0;

	getTotalDurationInSeconds(): number {
		return this.totalDurationInSeconds;
	}

	constructor(
		introAudio: CaptionedAudio,
		outroAudio: CaptionedAudio,
		questions: BasicQuizQuestion[],
		backgrounds: BasicQuizBackgrounds = {},
	) {
		this.buildTimeline(introAudio, outroAudio, questions, backgrounds);
	}

	getQuestionWithTime(question: BasicQuizQuestion): BasicQuizQuestionWithTime {
		const questionAudio = this.audioSequences.find(
			(sequence) =>
				sequence.type === 'question' && sequence.question === question,
		)!;
		const answerAudio = this.audioSequences.find(
			(sequence) =>
				sequence.type === 'answer' && sequence.question === question,
		)!;
		const commentAudio = this.audioSequences.find(
			(sequence) =>
				sequence.type === 'comment' && sequence.question === question,
		);

		const finalAudio = commentAudio ?? answerAudio;
		const durationInSeconds =
			finalAudio.startInSeconds +
			finalAudio.durationInSeconds! -
			questionAudio.startInSeconds;
		return {
			startInSeconds: questionAudio.startInSeconds,
			durationInSeconds,
			bgUrl: question.bgUrl,
			bgDurationInSeconds: this.backgroundSequences.find(
				(sequence) =>
					sequence.type === 'question' && sequence.question === question,
			)?.durationInSeconds,
			audios: commentAudio
				? [
						this.addTime(question.audios[0], questionAudio.startInSeconds),
						this.addTime(question.audios[1], answerAudio.startInSeconds),
						this.addTime(question.audios[2], commentAudio.startInSeconds),
					]
				: [
						this.addTime(question.audios[0], questionAudio.startInSeconds),
						this.addTime(question.audios[1], answerAudio.startInSeconds),
					],
			answer: question.answer,
			answerInSeconds: answerAudio.startInSeconds,
		};
	}

	getInterludeAudioWithTime(
		audio: CaptionedAudio,
		type: 'intro' | 'outro',
	): CaptionedAudio {
		const audioSequence = this.audioSequences.find(
			(sequence) => sequence.type === type,
		)!;
		return this.addTime(audio, audioSequence.startInSeconds);
	}

	static getTimeForAnswer(
		questions: BasicQuizQuestion[],
		introAudio: CaptionedAudio,
		outroAudio: CaptionedAudio,
	): number {
		if (questions.length === 0) return Infinity;
		const totalQuestionsAndAnswersTime = questions.reduce((acc, question) => {
			return (
				acc +
				question.audios.reduce((acc2, audio) => {
					return acc2 + audio.durationInSeconds;
				}, 0) +
				this.gapBetweenQuestions +
				this.gapBeforeAnswer * 2
			);
		}, 0);

		const totalIntroTime =
			introAudio.durationInSeconds + BasicQuizTimeline.gapBetweenQuestions;
		const totalOutroTime =
			outroAudio.durationInSeconds + BasicQuizTimeline.gapBetweenQuestions;

		const timeForAnswers =
			BasicQuizTimeline.videoDuration -
			totalIntroTime -
			totalQuestionsAndAnswersTime -
			totalOutroTime;
		return timeForAnswers / questions.length;
	}

	private buildTimeline(
		introAudio: CaptionedAudio,
		outroAudio: CaptionedAudio,
		questions: BasicQuizQuestion[],
		backgrounds: BasicQuizBackgrounds = {},
	): void {
		const { introBgUrl, outroBgUrl, bgUrls } = backgrounds;
		if (bgUrls && bgUrls.length > 0) {
			const timeForTransitionBetweenBackgrounds = 3;
			const bgDuration =
				(BasicQuizTimeline.videoDuration +
					timeForTransitionBetweenBackgrounds) /
				bgUrls.length;
			bgUrls.forEach((bgUrl, index) => {
				this.backgroundSequences.push({
					startInSeconds: index * bgDuration,
					durationInSeconds: bgDuration,
					type: 'filler',
					bgUrl,
				});
			});
		}

		const availableAnswerTime = BasicQuizTimeline.getTimeForAnswer(
			questions,
			introAudio,
			outroAudio,
		);
		if (
			questions.length === 0 ||
			availableAnswerTime < BasicQuizTimeline.minTimeForAnswer
		) {
			throw new Error(
				'Quiz narration cannot fit within 60 seconds with at least one question and a positive answer countdown',
			);
		}
		this.timeForOneAnswer = Math.min(
			availableAnswerTime,
			BasicQuizTimeline.maxTimeForAnswer,
		);

		let currentTime = 0;

		currentTime = this.buildInterludeTimeline(
			introBgUrl,
			currentTime,
			introAudio,
			'intro',
		);
		questions.forEach((question) => {
			currentTime = this.buildQuestionTimeline(currentTime, question);
		});
		currentTime = this.buildInterludeTimeline(
			outroBgUrl,
			currentTime,
			outroAudio,
			'outro',
		);
		this.totalDurationInSeconds = currentTime;
	}

	private buildInterludeTimeline(
		bgUrl: string | undefined,
		currentTime: number,
		audio: CaptionedAudio,
		type: 'intro' | 'outro',
	) {
		if (bgUrl) {
			this.backgroundSequences.push({
				startInSeconds: currentTime,
				durationInSeconds:
					audio.durationInSeconds + BasicQuizTimeline.gapBetweenQuestions,
				type,
				bgUrl,
			});
		}
		this.audioSequences.push({
			startInSeconds: currentTime,
			durationInSeconds: this.getAudioDuration(audio),
			type,
		});
		audio.captions.forEach((caption) => {
			this.captionSequences.push({
				startInSeconds: currentTime + caption.startInSeconds,
				type,
			});
		});

		currentTime +=
			audio.durationInSeconds + BasicQuizTimeline.gapBetweenQuestions;
		return currentTime;
	}

	private buildQuestionTimeline(
		currentTime: number,
		question: BasicQuizQuestion,
	) {
		const questionStart = currentTime;
		this.audioSequences.push({
			startInSeconds: currentTime,
			durationInSeconds: this.getAudioDuration(question.audios[0]),
			type: 'question',
			question,
		});
		// The question narration and its captions share the same clip start.
		// question
		const progressBarTime = currentTime + question.audios[0].durationInSeconds;
		this.progressBarSequences.push({
			startInSeconds: progressBarTime,
			durationInSeconds:
				this.timeForOneAnswer +
				BasicQuizTimeline.gapBeforeAnswer +
				BasicQuizTimeline.gapBeforeAnswer,
			type: 'question',
			question,
		});

		question.audios[0].captions.forEach((caption) => {
			this.captionSequences.push({
				startInSeconds: currentTime + caption.startInSeconds,
				type: 'question',
				question,
			});
		});
		currentTime +=
			question.audios[0].durationInSeconds +
			this.timeForOneAnswer +
			BasicQuizTimeline.gapBeforeAnswer +
			BasicQuizTimeline.gapBeforeAnswer;

		// answer
		this.audioSequences.push({
			startInSeconds: currentTime,
			durationInSeconds: this.getAudioDuration(question.audios[1]),
			type: 'answer',
			question,
		});
		question.audios[1].captions.forEach((caption) => {
			this.captionSequences.push({
				startInSeconds: currentTime + caption.startInSeconds,
				type: 'answer',
				question,
			});
		});
		currentTime += question.audios[1].durationInSeconds;

		// optional comment
		if (question.audios.length === 3) {
			this.audioSequences.push({
				startInSeconds: currentTime,
				durationInSeconds: this.getAudioDuration(question.audios[2]),
				type: 'comment',
				question,
			});
			question.audios[2].captions.forEach((caption) => {
				this.captionSequences.push({
					startInSeconds: currentTime + caption.startInSeconds,
					type: 'comment',
					question,
				});
			});
			currentTime += question.audios[2].durationInSeconds;
		}

		currentTime += BasicQuizTimeline.gapBetweenQuestions;
		if (question.bgUrl) {
			this.backgroundSequences.push({
				startInSeconds: questionStart,
				durationInSeconds: currentTime - questionStart,
				type: 'question',
				question,
				bgUrl: question.bgUrl,
			});
		}
		return currentTime;
	}

	private addTime(
		audio: CaptionedAudio,
		startInSeconds: number,
	): CaptionedAudio {
		return {
			audioUrl: audio.audioUrl,
			startInSeconds,
			durationInSeconds: this.getAudioDuration(audio),
			captions: audio.captions.map((caption) => {
				return {
					startInSeconds: caption.startInSeconds + startInSeconds,
					endInSeconds: caption.endInSeconds + startInSeconds,
					text: caption.text,
				};
			}),
		};
	}

	private getAudioDuration(audio: CaptionedAudio): number {
		return audio.durationInSeconds;
	}
}
