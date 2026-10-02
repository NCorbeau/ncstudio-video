import { z } from 'zod';

const captionSchema = z
	.object({
		startInSeconds: z.number().finite().nonnegative(),
		endInSeconds: z.number().finite().nonnegative(),
		text: z.string(),
	})
	.refine((caption) => caption.endInSeconds >= caption.startInSeconds, {
		message: 'Caption end must be at or after its start',
		path: ['endInSeconds'],
	});

export const audioSchema = z
	.object({
		audioUrl: z.string().min(1),
		durationInSeconds: z.number().finite().positive(),
		captions: z
			.array(captionSchema)
			.min(1, 'Narrated audio needs timestamped captions'),
	})
	.superRefine((audio, context) => {
		audio.captions.forEach((caption, index) => {
			if (caption.endInSeconds > audio.durationInSeconds) {
				context.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Caption extends past audio duration',
					path: ['captions', index, 'endInSeconds'],
				});
			}
			if (
				index > 0 &&
				caption.startInSeconds < audio.captions[index - 1].startInSeconds
			) {
				context.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Captions must be in chronological order',
					path: ['captions', index, 'startInSeconds'],
				});
			}
		});
	});
