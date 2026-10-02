import { AbsoluteFill } from 'remotion';
import { useContext } from 'react';
import { RankingTopic } from './RankingTopics';
import { RankingContext } from '../RankingContext';
import { RankingAudio } from '../audio/RankingAudio';

type RankingTopicContainerProps = { readonly topic: RankingTopic };

export const RankingTopicContainer: React.FC<RankingTopicContainerProps> = ({
	topic,
}) => {
	const { timeline } = useContext(RankingContext);
	if (!timeline) return null;
	return (
		<AbsoluteFill>
			<RankingAudio audio={timeline.getTopicAudioWithAdjustedTime(topic)} />
		</AbsoluteFill>
	);
};
