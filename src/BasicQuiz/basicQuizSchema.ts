import { z } from 'zod';
import { audioSchema } from '../common/audio/audioSchema';

export const basicQuizSchema = z.object({
	quizName: z.string(),
	bgUrls: z.optional(z.array(z.string().min(1)).min(1)),
	introAudio: audioSchema,
	outroAudio: audioSchema,
	introBgUrl: z.optional(z.string()),
	outroBgUrl: z.optional(z.string()),
	questions: z
		.array(
			z.object({
				answer: z.string(),
				audios: z.array(audioSchema).min(2).max(3),
				bgUrl: z.optional(z.string()),
			}),
		)
		.min(1),
});
