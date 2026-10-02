import { z } from 'zod';

const videoSizeSchema = z.object({
	width: z.number().finite().positive(),
	height: z.number().finite().positive(),
});

const videoPositionSchema = z.object({
	x: z.number().finite(),
	y: z.number().finite(),
});

export const videoSchema = z.object({
	videoUrl: z.string().min(1),
	startInSeconds: z.number().finite().nonnegative(),
	durationInSeconds: z.number().finite().positive(),
	size: videoSizeSchema,
	position: videoPositionSchema,
	muted: z.boolean(),
	brightness: z.number().finite().nonnegative().optional(),
});
