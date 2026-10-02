import {
	useCurrentFrame,
	useVideoConfig,
	spring,
	AbsoluteFill,
} from 'remotion';
import { BasicQuizCaptionBlock } from './BasicQuizCaptionBlock';
import { Caption } from '../../common/captions/Caption';

export type BasicQuizCaptionProps = {
	captions: Caption[];
};

export const BasicQuizCaption: React.FC<BasicQuizCaptionProps> = ({
	captions,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const startInSeconds = captions[0]?.startInSeconds ?? 0;
	const adjustedCaptions = captions.map((caption) => ({
		...caption,
		startInSeconds: caption.startInSeconds - startInSeconds,
		endInSeconds: caption.endInSeconds - startInSeconds,
	}));

	const enter = spring({
		frame,
		fps,
		config: {
			damping: 200,
		},
		durationInFrames: 2,
	});

	if (adjustedCaptions.length === 0) {
		return null;
	}

	return (
		<AbsoluteFill>
			<AbsoluteFill>
				<BasicQuizCaptionBlock
					stroke
					enterProgress={enter}
					captions={adjustedCaptions}
				/>
			</AbsoluteFill>
			<AbsoluteFill>
				<BasicQuizCaptionBlock
					enterProgress={enter}
					captions={adjustedCaptions}
					stroke={false}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
