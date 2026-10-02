import { z } from 'zod';
import { audioSchema } from '../common/audio/audioSchema';
import { videoSchema } from '../common/video/videoSchema';

const shotSchema = z.object({
	videos: z.array(videoSchema).min(1),
});

const topicSchema = z.object({
	name: z.string().min(1),
	audio: audioSchema,
	shots: z.array(shotSchema).min(1),
	bgUrl: z.string().optional(),
	number: z.number().int().positive().optional(),
	text: z.string().optional(),
	references: z.string().optional(),
});

export const rankingSchema = z.object({
	subject: z.string().min(1),
	topics: z.array(topicSchema).min(1),
	closing: z.object({ audio: audioSchema, text: z.string().optional() }),
});
