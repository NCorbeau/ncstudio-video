import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { CaptionBlock } from '../../common/captions/CaptionBlock';
import { RankingCaption } from './RankingCaption';

export type RankingCaptionContainerProps = {
	readonly captionBlocks: CaptionBlock[];
};
export const RankingCaptionsTop = 1400;

export const RankingCaptionContainer: React.FC<
	RankingCaptionContainerProps
> = ({ captionBlocks }) => {
	const { fps } = useVideoConfig();
	const blocks = captionBlocks.map((block, index) => {
		const from = Math.round(block.startInSeconds * fps);
		const end = Math.ceil(block.endInSeconds * fps);
		if (end <= from) return null;
		return (
			<Sequence
				key={index}
				name="Caption"
				from={from}
				durationInFrames={end - from}
			>
				<RankingCaption captions={block.captions} />
			</Sequence>
		);
	});
	return (
		<AbsoluteFill style={{ top: RankingCaptionsTop }}>{blocks}</AbsoluteFill>
	);
};
