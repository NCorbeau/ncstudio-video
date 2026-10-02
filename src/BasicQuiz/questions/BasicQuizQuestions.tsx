import { AbsoluteFill } from 'remotion';
import { BasicQuizQuestionWithTime } from './BasicQuizQuestion';
import { BasicQuizCategory } from './BasicQuizCategory';
import { useContext } from 'react';
import { GaretHeavyFont } from '../loadBasicQuizFonts';
import { BasicQuizContext } from '../BasicQuizContext';
import { BasicQuizProgressBar } from '../progress-bar/BasicQuizProgressBar';
import {
	BasicQuizCaptionContainer,
	BasicQuizCaptionsTop,
} from '../captions/BasicQuizCaptionContainer';
import React from 'react';
import { BasicQuizCaptionsProcessor } from '../captions/BasicQuizCaptionsProcessor';

export type QuestionsWithStartIndex = {
	questions: BasicQuizQuestionWithTime[];
	startIndex: number;
};

type BasicQuizQuestionsProps = {
	readonly easyQuestions: QuestionsWithStartIndex;
	readonly mediumQuestions: QuestionsWithStartIndex;
	readonly hardQuestions: QuestionsWithStartIndex;
	readonly extremeQuestions: QuestionsWithStartIndex;
};

const fontFamily = GaretHeavyFont;

export const BasicQuizQuestions: React.FC<BasicQuizQuestionsProps> = ({
	easyQuestions,
	mediumQuestions,
	hardQuestions,
	extremeQuestions,
}) => {
	const { timeline } = useContext(BasicQuizContext);
	const allQuestions = [
		easyQuestions.questions,
		mediumQuestions.questions,
		hardQuestions.questions,
		extremeQuestions.questions,
	].flat();
	const captionBlocks = BasicQuizCaptionsProcessor.processCaptions(
		allQuestions.flatMap((question) => question.audios),
	);

	const bars =
		timeline?.progressBarSequences.map((seq) => {
			return {
				startInSeconds: seq.startInSeconds,
				durationInSeconds: seq.durationInSeconds!,
			};
		}) ?? [];

	const getNumberOfQuestions = () => {
		return (
			easyQuestions.questions.length +
			mediumQuestions.questions.length +
			hardQuestions.questions.length +
			extremeQuestions.questions.length
		);
	};

	const calculateMarginTop = (numQuestions: number): number => {
		switch (numQuestions) {
			case 7:
				return 60;
			case 8:
				return 40;
			case 9:
				return 20;
			case 10:
				return 0;
			default:
				return 0;
		}
	};

	const getCategoryGap = (numQuestions: number): number => {
		switch (numQuestions) {
			case 7:
				return 30;
			case 8:
				return 20;
			case 9:
				return 15;
			case 10:
				return 5;
			default:
				return 5;
		}
	};

	const fiveQuestionGap = 30;

	if (!allQuestions.length) {
		return null;
	}

	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					top: BasicQuizCaptionsTop,
				}}
			>
				<BasicQuizCaptionContainer captionBlocks={captionBlocks} />
				<BasicQuizProgressBar bars={bars} />
			</AbsoluteFill>
			<AbsoluteFill
				style={{
					top: getNumberOfQuestions() === 6 ? 620 : 585,
					left: 120,
					lineHeight: 1.2,
					WebkitTextStroke: '2px black',
				}}
			>
				{getNumberOfQuestions() <= 5 ? (
					<div
						style={{
							marginTop: 100 + 50,
							fontSize: 50,
							fontFamily,
							color: 'white',
							display: 'flex',
							gap: 80,
							flexDirection: 'column',
						}}
					>
						<BasicQuizCategory
							title="Easy"
							color="rgb(222, 218, 206)"
							startIndex={easyQuestions.startIndex}
							questions={easyQuestions.questions}
							gap={fiveQuestionGap}
						/>
						<BasicQuizCategory
							title="Medium"
							color="rgb(254, 185, 95)"
							startIndex={mediumQuestions.startIndex}
							questions={mediumQuestions.questions}
							gap={fiveQuestionGap}
						/>
						<BasicQuizCategory
							title="Hard"
							color="rgb(247, 23, 53)"
							startIndex={hardQuestions.startIndex}
							questions={hardQuestions.questions}
							gap={fiveQuestionGap}
						/>
						<BasicQuizCategory
							title="Extreme"
							color="rgb(194, 9, 90)"
							startIndex={extremeQuestions.startIndex}
							questions={extremeQuestions.questions}
							gap={fiveQuestionGap}
						/>
					</div>
				) : (
					<div
						style={{
							marginTop: calculateMarginTop(getNumberOfQuestions()) + 100,
							fontSize: 50,
							fontFamily,
							color: 'white',
							display: 'flex',
							gap: 50 - (getNumberOfQuestions() - 7) * 11,
							flexDirection: 'column',
						}}
					>
						<BasicQuizCategory
							title="Easy"
							color="rgb(222, 218, 206)"
							startIndex={easyQuestions.startIndex}
							questions={easyQuestions.questions}
							gap={getCategoryGap(getNumberOfQuestions())}
						/>
						<BasicQuizCategory
							title="Medium"
							color="rgb(254, 185, 95)"
							startIndex={mediumQuestions.startIndex}
							questions={mediumQuestions.questions}
							gap={getCategoryGap(getNumberOfQuestions())}
						/>
						<BasicQuizCategory
							title="Hard"
							color="rgb(247, 23, 53)"
							startIndex={hardQuestions.startIndex}
							questions={hardQuestions.questions}
							gap={getCategoryGap(getNumberOfQuestions())}
						/>
						<BasicQuizCategory
							title="Extreme"
							color="rgb(194, 9, 90)"
							startIndex={extremeQuestions.startIndex}
							questions={extremeQuestions.questions}
							gap={getCategoryGap(getNumberOfQuestions())}
						/>
					</div>
				)}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
