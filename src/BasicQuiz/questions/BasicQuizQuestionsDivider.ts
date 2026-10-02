import { BasicQuizQuestionWithTime } from './BasicQuizQuestion';

export type BasicQuizQuestionsDividerResult = {
	easyQuestions: BasicQuizQuestionWithTime[];
	mediumQuestions: BasicQuizQuestionWithTime[];
	hardQuestions: BasicQuizQuestionWithTime[];
	extremeQuestions: BasicQuizQuestionWithTime[];
};

export class BasicQuizQuestionsDivider {
	static divideQuestions(
		questions: BasicQuizQuestionWithTime[],
	): BasicQuizQuestionsDividerResult {
		switch (questions.length) {
			case 0:
				return {
					easyQuestions: [],
					mediumQuestions: [],
					hardQuestions: [],
					extremeQuestions: [],
				};
			case 1:
				return {
					easyQuestions: [questions[0]],
					mediumQuestions: [],
					hardQuestions: [],
					extremeQuestions: [],
				};
			case 2:
				return {
					easyQuestions: [questions[0]],
					mediumQuestions: [questions[1]],
					hardQuestions: [],
					extremeQuestions: [],
				};
			case 3:
				return {
					easyQuestions: [questions[0]],
					mediumQuestions: [questions[1]],
					hardQuestions: [questions[2]],
					extremeQuestions: [],
				};
			case 4:
				return {
					easyQuestions: [questions[0]],
					mediumQuestions: [questions[1], questions[2]],
					hardQuestions: [questions[3]],
					extremeQuestions: [],
				};
			case 5:
				return {
					easyQuestions: [questions[0]],
					mediumQuestions: [questions[1], questions[2]],
					hardQuestions: [questions[3], questions[4]],
					extremeQuestions: [],
				};
			case 6:
				return {
					easyQuestions: [questions[0], questions[1]],
					mediumQuestions: [questions[2], questions[3]],
					hardQuestions: [questions[4]],
					extremeQuestions: [questions[5]],
				};
			case 7:
				return {
					easyQuestions: [questions[0], questions[1]],
					mediumQuestions: [questions[2], questions[3]],
					hardQuestions: [questions[4], questions[5]],
					extremeQuestions: [questions[6]],
				};
			case 8:
				return {
					easyQuestions: [questions[0], questions[1]],
					mediumQuestions: [questions[2], questions[3], questions[4]],
					hardQuestions: [questions[5], questions[6]],
					extremeQuestions: [questions[7]],
				};
			case 9:
				return {
					easyQuestions: [questions[0], questions[1], questions[2]],
					mediumQuestions: [questions[3], questions[4], questions[5]],
					hardQuestions: [questions[6], questions[7]],
					extremeQuestions: [questions[8]],
				};
			case 10:
				return {
					easyQuestions: [questions[0], questions[1], questions[2]],
					mediumQuestions: [questions[3], questions[4], questions[5]],
					hardQuestions: [questions[6], questions[7], questions[8]],
					extremeQuestions: [questions[9]],
				};
			default:
				throw new Error('Too many questions');
		}
	}
}
