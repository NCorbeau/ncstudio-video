import { z } from 'zod';

const subtitleSchema = z
	.object({
		startInSeconds: z.number().finite().nonnegative(),
		endInSeconds: z.number().finite().nonnegative().optional(),
		text: z.string(),
	})
	.refine(
		(subtitle) =>
			subtitle.endInSeconds === undefined ||
			subtitle.endInSeconds >= subtitle.startInSeconds,
		{
			message: 'Subtitle end must be at or after its start',
			path: ['endInSeconds'],
		},
	);

export const subtitleFileSchema = z
	.object({ transcription: z.array(subtitleSchema) })
	.superRefine(({ transcription }, context) => {
		transcription.forEach((subtitle, index) => {
			if (
				index > 0 &&
				subtitle.startInSeconds < transcription[index - 1].startInSeconds
			) {
				context.addIssue({
					code: 'custom',
					message: 'Subtitles must be in chronological order',
					path: ['transcription', index, 'startInSeconds'],
				});
			}
		});
	});

export type SubtitleProp = z.infer<typeof subtitleSchema>;
