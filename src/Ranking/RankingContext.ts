import { createContext } from 'react';
import { RankingTimeline } from './RankingTimeline';
import { RankingTopic } from './topics/RankingTopics';

type RankingContextData = {
	timeline?: RankingTimeline;
	topics: RankingTopic[];
};

export const RankingContext = createContext<RankingContextData>({
	timeline: undefined,
	topics: [],
});
