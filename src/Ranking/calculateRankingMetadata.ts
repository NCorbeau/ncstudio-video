import { CalculateMetadataFunction } from 'remotion';
import { z } from 'zod';
import { rankingSchema } from './rankingSchema';
import { RankingTimeline } from './RankingTimeline';

export const calculateRankingMetadata: CalculateMetadataFunction<
	z.infer<typeof rankingSchema>
> = async ({ props }) => {
	const fps = 30;

	const parsed = rankingSchema.parse(props);
	const timeline = new RankingTimeline(parsed.topics, parsed.closing);
	const durationInSeconds = timeline.getTotalDurationInSeconds();

	return {
		fps,
		durationInFrames: Math.ceil(durationInSeconds * fps),
	};
};
