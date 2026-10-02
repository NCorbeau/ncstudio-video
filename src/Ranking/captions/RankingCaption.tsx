import {
	useCurrentFrame,
	useVideoConfig,
	spring,
	AbsoluteFill,
} from 'remotion';
import { Caption } from '../../common/captions/Caption';
import { RankingCaptionBlock } from './RankingCaptionBlock';

export type RankingCaptionProps = {
	captions: Caption[];
};

export const RankingCaption: React.FC<RankingCaptionProps> = ({ captions }) => {
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
				<RankingCaptionBlock
					stroke
					enterProgress={enter}
					captions={adjustedCaptions}
				/>
			</AbsoluteFill>
			<AbsoluteFill>
				<RankingCaptionBlock
					enterProgress={enter}
					captions={adjustedCaptions}
					stroke={false}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
