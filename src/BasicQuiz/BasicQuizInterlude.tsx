import { AbsoluteFill } from 'remotion';
import { CaptionedAudio } from '../common/audio/CaptionedAudio';
import {
	BasicQuizCaptionContainer,
	BasicQuizCaptionsTop,
} from './captions/BasicQuizCaptionContainer';
import { BasicQuizAudio } from './audio/BasicQuizAudio';
import { BasicQuizCaptionsProcessor } from './captions/BasicQuizCaptionsProcessor';

type BasicQuizInterludeProps = {
	audio: CaptionedAudio;
};

export const BasicQuizInterlude: React.FC<BasicQuizInterludeProps> = ({
	audio,
}) => {
	const captionBlocks = BasicQuizCaptionsProcessor.processCaptions([audio]);

	return (
		<AbsoluteFill
			style={{
				top: BasicQuizCaptionsTop,
			}}
		>
			<BasicQuizCaptionContainer captionBlocks={captionBlocks} />
			<BasicQuizAudio audio={audio} />
		</AbsoluteFill>
	);
};
