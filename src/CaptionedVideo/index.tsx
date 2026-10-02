import { useCallback, useEffect, useState } from 'react';
import {
	AbsoluteFill,
	CalculateMetadataFunction,
	cancelRender,
	continueRender,
	delayRender,
	getRemotionEnvironment,
	OffthreadVideo,
	Sequence,
	useVideoConfig,
	watchStaticFile,
} from 'remotion';
import { z } from 'zod';
import Subtitle from './Subtitle';
import { getVideoMetadata } from '@remotion/media-utils';
import { loadBasicQuizFonts } from '../BasicQuiz/loadBasicQuizFonts';
import { NoCaptionFile } from './NoCaptionFile';
import { subtitleFileSchema, SubtitleProp } from './subtitleSchema';
export type { SubtitleProp } from './subtitleSchema';

export const captionedVideoSchema = z.object({
	src: z.string().min(1),
});

export const calculateCaptionedVideoMetadata: CalculateMetadataFunction<
	z.infer<typeof captionedVideoSchema>
> = async ({ props }) => {
	const fps = 30;
	const parsed = captionedVideoSchema.parse(props);
	const metadata = await getVideoMetadata(parsed.src);

	return {
		fps,
		durationInFrames: Math.ceil(metadata.durationInSeconds * fps),
	};
};

export const CaptionedVideo: React.FC<{
	readonly src: string;
}> = ({ src }) => {
	const [subtitles, setSubtitles] = useState<SubtitleProp[]>([]);
	const [missingSidecar, setMissingSidecar] = useState(false);
	const [handle] = useState(() => delayRender());
	const { fps } = useVideoConfig();

	const subtitlesFile = src.replace(/\.(mp4|mkv|mov|webm)(?=[?#]|$)/i, '.json');

	const fetchSubtitles = useCallback(async () => {
		try {
			await loadBasicQuizFonts();
			const res = await fetch(subtitlesFile);
			if (res.status === 404) {
				setMissingSidecar(true);
				setSubtitles([]);
			} else {
				if (!res.ok)
					throw new Error(`Cannot load subtitle sidecar: HTTP ${res.status}`);
				const result = subtitleFileSchema.safeParse(await res.json());
				if (!result.success) {
					throw new Error(
						`Invalid subtitle sidecar: ${result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')}`,
					);
				}
				const {data} = result;
				setMissingSidecar(false);
				setSubtitles(data.transcription);
			}
			continueRender(handle);
		} catch (e) {
			cancelRender(e);
		}
	}, [handle, subtitlesFile]);

	useEffect(() => {
		fetchSubtitles();
		if (!getRemotionEnvironment().isStudio) return;

		const c = watchStaticFile(subtitlesFile, () => {
			fetchSubtitles();
		});

		return () => {
			c.cancel();
		};
	}, [fetchSubtitles, src, subtitlesFile]);

	return (
		<AbsoluteFill style={{ backgroundColor: 'white' }}>
			<AbsoluteFill>
				<OffthreadVideo
					style={{
						objectFit: 'cover',
					}}
					src={src}
				/>
			</AbsoluteFill>
			{subtitles.map((subtitle, index) => {
				const nextSubtitle = subtitles[index + 1] ?? null;
				const subtitleStartFrame = Math.round(subtitle.startInSeconds * fps);
				const subtitleEndFrame = Math.min(
					nextSubtitle
						? Math.round(nextSubtitle.startInSeconds * fps)
						: Infinity,
					subtitle.endInSeconds === undefined
						? subtitleStartFrame + fps
						: Math.ceil(subtitle.endInSeconds * fps),
				);
				const durationInFrames = subtitleEndFrame - subtitleStartFrame;
				if (durationInFrames <= 0) {
					return null;
				}

				return (
					<Sequence
						key={index}
						from={subtitleStartFrame}
						durationInFrames={durationInFrames}
					>
						<Subtitle text={subtitle.text} />
					</Sequence>
				);
			})}
			{missingSidecar && <NoCaptionFile />}
		</AbsoluteFill>
	);
};
