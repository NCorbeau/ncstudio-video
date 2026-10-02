import { createContext } from 'react';
import { BasicQuizTimeline } from './BasicQuizTimeline';

type BasicQuizContextData = {
	timeline?: BasicQuizTimeline;
};

export const BasicQuizContext = createContext<BasicQuizContextData>({
	timeline: undefined,
});
