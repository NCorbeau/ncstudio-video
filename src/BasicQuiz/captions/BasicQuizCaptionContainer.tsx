import { Sequence, useVideoConfig } from 'remotion';
import { CaptionBlock } from '../../common/captions/CaptionBlock';
import { BasicQuizCaption } from './BasicQuizCaption';

export type BasicQuizCaptionsProps = { readonly captionBlocks: CaptionBlock[] };
export const BasicQuizCaptionsTop = 550;

export const BasicQuizCaptionContainer: React.FC<BasicQuizCaptionsProps> = ({
	captionBlocks,
}) => {
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
				<BasicQuizCaption captions={block.captions} />
			</Sequence>
		);
	});
	return <div>{blocks}</div>;
};
