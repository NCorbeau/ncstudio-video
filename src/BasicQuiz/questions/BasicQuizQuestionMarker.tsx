import { BasicQuizQuestionWithTime } from './BasicQuizQuestion';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export type BasicQuizQuestionMarkerProps = {
	question: BasicQuizQuestionWithTime;
};

export const BasicQuizQuestionMarker: React.FC<
	BasicQuizQuestionMarkerProps
> = ({ question }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const getColor = () => {
		const currentTimeInSeconds = frame / fps;
		const isPastQuestion = currentTimeInSeconds > question.answerInSeconds;
		const isCurrentQuestion =
			currentTimeInSeconds >= question.startInSeconds &&
			currentTimeInSeconds <= question.answerInSeconds;
		const isFutureQuestion = currentTimeInSeconds < question.startInSeconds;

		if (isPastQuestion) {
			return '#85AF46';
		}
		if (isCurrentQuestion) {
			return '#F48B01';
		}
		if (isFutureQuestion) {
			return 'white';
		}
	};

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				fontSize: 60,
				marginLeft: 0,
				color: getColor(),
				transform: 'scale(3.3)',
			}}
		>
			<svg
				style={{
					fill: getColor(),
					strokeWidth: 1,
					stroke: 'black',
					strokeLinecap: 'square',
					strokeLinejoin: 'miter',
				}}
				xmlns="http://www.w3.org/2000/svg"
				width="10.605"
				height="15.555"
			>
				<path d="m2.828 15.555 7.777-7.779L2.828 0 0 2.828l4.949 4.948L0 12.727l2.828 2.828z" />
			</svg>
		</div>
	);
};
