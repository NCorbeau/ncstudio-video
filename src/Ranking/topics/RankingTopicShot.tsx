import { useContext } from 'react';
import { RankingShot, RankingTopic } from './RankingTopics';
import { RankingContext } from '../RankingContext';
import { RankingVideoContainer } from '../video/RankingVideoContainer';

type RankingShotProps = {
	readonly topic: RankingTopic;
	readonly shotIndex: number;
	readonly shot: RankingShot;
};

export const RankingTopicShot: React.FC<RankingShotProps> = ({
	shot,
	shotIndex,
	topic,
}) => {
	const { timeline } = useContext(RankingContext);
	if (!timeline || shot.videos.length === 0) return null;
	return (
		<RankingVideoContainer
			videosWithTopic={timeline
				.getShotVideosWithAdjustedTime(topic, shotIndex)
				.map((video) => ({ video, topic }))}
		/>
	);
};
