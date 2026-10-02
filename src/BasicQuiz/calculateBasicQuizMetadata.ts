import { CalculateMetadataFunction } from 'remotion';
import { z } from 'zod';
import { basicQuizSchema } from './basicQuizSchema';
import { BasicQuizQuestionsProcessor } from './questions/BasicQuizQuestionsProcessor';
import { BasicQuizTimeline } from './BasicQuizTimeline';

export const calculateBasicQuizMetadata: CalculateMetadataFunction<
	z.infer<typeof basicQuizSchema>
> = ({ props }) => {
	const parsed = basicQuizSchema.parse(props);
	const questions = BasicQuizQuestionsProcessor.processQuestions(
		parsed.questions,
		parsed.introAudio,
		parsed.outroAudio,
	);
	const timeline = new BasicQuizTimeline(
		parsed.introAudio,
		parsed.outroAudio,
		questions,
	);
	const fps = 30;
	return {
		fps,
		durationInFrames: Math.ceil(timeline.getTotalDurationInSeconds() * fps),
	};
};
