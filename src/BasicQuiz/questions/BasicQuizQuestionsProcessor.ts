import { BasicQuizTimeline } from '../BasicQuizTimeline';
import { CaptionedAudio } from '../../common/audio/CaptionedAudio';
import { BasicQuizQuestion } from './BasicQuizQuestion';

export class BasicQuizQuestionsProcessor {
	static processQuestions = (
		questions: Array<BasicQuizQuestion>,
		introAudio: CaptionedAudio,
		outroAudio: CaptionedAudio,
	): Array<BasicQuizQuestion> => {
		const slicedQuestions =
			questions.length >= 10 ? questions.slice(0, 10) : questions.slice(0, 5);
		let fittedQuestions = slicedQuestions;

		while (
			BasicQuizTimeline.getTimeForAnswer(
				fittedQuestions,
				introAudio,
				outroAudio,
			) < BasicQuizTimeline.minTimeForAnswer &&
			fittedQuestions.find((q) => q.audios.length === 3)
		) {
			const lastQuestionWithComment = fittedQuestions
				.filter((q) => q.audios.length === 3)
				.at(-1);
			if (lastQuestionWithComment) {
				const index = fittedQuestions.indexOf(lastQuestionWithComment);
				fittedQuestions = [
					...fittedQuestions.slice(0, index),
					{
						...lastQuestionWithComment,
						audios: lastQuestionWithComment.audios.slice(0, 2),
					},
					...fittedQuestions.slice(index + 1),
				];
			} else {
				fittedQuestions = fittedQuestions.slice(0, fittedQuestions.length - 1);
			}
		}

		while (
			BasicQuizTimeline.getTimeForAnswer(
				fittedQuestions,
				introAudio,
				outroAudio,
			) < BasicQuizTimeline.minTimeForAnswer
		) {
			if (fittedQuestions.length <= 1) {
				throw new Error('Quiz narration is too long for the 60-second format');
			}
			fittedQuestions = fittedQuestions.slice(0, fittedQuestions.length - 1);
		}

		if (fittedQuestions.length === 0) {
			throw new Error('Quiz requires at least one question');
		}
		return fittedQuestions;
	};
}
