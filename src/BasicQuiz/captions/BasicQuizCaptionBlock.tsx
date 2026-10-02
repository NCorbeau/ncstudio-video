import { fitText } from '@remotion/layout-utils';
import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import { TheBoldFont } from '../loadBasicQuizFonts';
import { makeTransform, scale, translateY } from '@remotion/animation-utils';
import { Caption } from '../../common/captions/Caption';

export type BasicQuizCaptionBlockProps = {
	captions: Caption[];
	stroke: boolean;
	enterProgress: number;
};

const fontFamily = TheBoldFont;

export const BasicQuizCaptionBlock: React.FC<BasicQuizCaptionBlockProps> = ({
	captions,
	stroke,
	enterProgress,
}) => {
	const { width, fps } = useVideoConfig();
	const frame = useCurrentFrame();

	const desiredFontSize = 80;

	const fittedText = fitText({
		fontFamily,
		text: captions.map((c) => c.text).join(' '),
		withinWidth: width * 0.7,
	});

	const fontSize = Math.min(desiredFontSize, fittedText.fontSize);

	const getColor = (caption: Caption) => {
		const currentTimeInSeconds = frame / fps;
		const isPastCaption = currentTimeInSeconds > caption.endInSeconds;
		const isCurrentCaption =
			currentTimeInSeconds >= caption.startInSeconds &&
			currentTimeInSeconds <= caption.endInSeconds;
		const isFutureCaption = currentTimeInSeconds < caption.startInSeconds;

		if (isPastCaption) {
			return 'white';
		}
		if (isCurrentCaption) {
			return 'white';
		}
		if (isFutureCaption) {
			return 'gray';
		}
	};

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				height: 150,
				top: 0,
			}}
		>
			<div
				style={{
					fontSize,
					color: 'white',
					WebkitTextStroke: stroke ? '20px black' : undefined,
					transform: makeTransform([
						scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
						translateY(interpolate(enterProgress, [0, 1], [50, 0])),
					]),
					fontFamily,
					textTransform: 'uppercase',
					display: 'flex',
					gap: 15,
				}}
			>
				{captions.map((caption, i) => (
					<span key={i} style={{ color: getColor(caption), marginRight: 10 }}>
						{caption.text}
					</span>
				))}
			</div>
		</AbsoluteFill>
	);
};
