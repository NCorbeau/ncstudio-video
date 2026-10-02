import {
	AbsoluteFill,
	cancelRender,
	continueRender,
	delayRender,
} from 'remotion';
import { BasicQuizName } from './BasicQuizName';
import { useEffect, useMemo, useState } from 'react';
import { loadBasicQuizFonts } from './loadBasicQuizFonts';
import { CaptionedAudio } from '../common/audio/CaptionedAudio';
import { BasicQuizTimeline } from './BasicQuizTimeline';
import { BasicQuizContext } from './BasicQuizContext';
import { BasicQuizInterlude } from './BasicQuizInterlude';
import { BackgroundWithTime } from '../common/background/BackgroundWithTime';
import { BasicQuizQuestion } from './questions/BasicQuizQuestion';
import { BasicQuizQuestions } from './questions/BasicQuizQuestions';
import { BasicQuizBackgroundContainer } from './background/BasicQuizBackgroundContainer';
import { BasicQuizQuestionsProcessor } from './questions/BasicQuizQuestionsProcessor';
import { BasicQuizQuestionsDivider } from './questions/BasicQuizQuestionsDivider';

export type BasicQuizProps = {
	quizName: string;
	introAudio: CaptionedAudio;
	outroAudio: CaptionedAudio;
	introBgUrl?: string;
	outroBgUrl?: string;
	bgUrls?: string[];
	questions: BasicQuizQuestion[];
};

export const BasicQuiz: React.FC<BasicQuizProps> = ({
	quizName,
	bgUrls,
	introAudio,
	outroAudio,
	introBgUrl,
	outroBgUrl,
	questions,
}) => {
	const [handle] = useState(() => delayRender());

	const [initialized, setInitialized] = useState(false);
	const {
		timeline,
		easyQuestions,
		mediumQuestions,
		hardQuestions,
		extremeQuestions,
	} = useMemo(() => {
		const processedQuestions = BasicQuizQuestionsProcessor.processQuestions(
			questions,
			introAudio,
			outroAudio,
		);
		const timeline = new BasicQuizTimeline(
			introAudio,
			outroAudio,
			processedQuestions,
			{ introBgUrl, outroBgUrl, bgUrls },
		);
		return {
			timeline,
			...BasicQuizQuestionsDivider.divideQuestions(
				processedQuestions.map((question) =>
					timeline.getQuestionWithTime(question),
				),
			),
		};
	}, [questions, introAudio, outroAudio, introBgUrl, outroBgUrl, bgUrls]);

	useEffect(() => {
		loadBasicQuizFonts()
			.then(() => {
				setInitialized(true);
				continueRender(handle);
			})
			.catch(cancelRender);
	}, [handle]);

	const getBackgrounds = (): BackgroundWithTime[] => {
		return timeline!.backgroundSequences.map((sequence) => {
			return {
				bgStartInSeconds: sequence.startInSeconds,
				bgDurationInSeconds: sequence.durationInSeconds ?? 60,
				bgUrl: sequence.bgUrl!,
			};
		});
	};

	if (!initialized || !timeline || !introAudio || !outroAudio) {
		return null;
	}

	return (
		<BasicQuizContext.Provider value={{ timeline }}>
			<AbsoluteFill style={{ backgroundColor: 'black' }}>
				<BasicQuizBackgroundContainer backgrounds={getBackgrounds()} />
				<BasicQuizInterlude
					audio={timeline!.getInterludeAudioWithTime(outroAudio, 'outro')}
				/>
				<BasicQuizQuestions
					easyQuestions={{ questions: easyQuestions, startIndex: 0 }}
					mediumQuestions={{
						questions: mediumQuestions,
						startIndex: easyQuestions.length,
					}}
					hardQuestions={{
						questions: hardQuestions,
						startIndex: easyQuestions.length + mediumQuestions.length,
					}}
					extremeQuestions={{
						questions: extremeQuestions,
						startIndex:
							easyQuestions.length +
							mediumQuestions.length +
							hardQuestions.length,
					}}
				/>
				<BasicQuizInterlude
					audio={timeline!.getInterludeAudioWithTime(introAudio, 'intro')}
				/>
				<BasicQuizName quizName={quizName} />
			</AbsoluteFill>
		</BasicQuizContext.Provider>
	);
};
