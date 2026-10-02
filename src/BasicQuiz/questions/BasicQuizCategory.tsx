import {
	Sequence,
	useVideoConfig,
	Audio,
	useCurrentFrame,
	spring,
} from 'remotion';
import { BasicQuizQuestionWithTime } from './BasicQuizQuestion';
import { BasicQuizQuestionMarker } from './BasicQuizQuestionMarker';
import { fitText } from '@remotion/layout-utils';
import { GaretHeavyFont } from '../loadBasicQuizFonts';

type BasicQuizCategoryProps = {
	title: string;
	color: string;
	startIndex: number;
	questions: BasicQuizQuestionWithTime[];
	gap?: number;
};

export const BasicQuizCategory: React.FC<BasicQuizCategoryProps> = ({
	title,
	color,
	questions,
	startIndex,
	gap,
}) => {
	const { fps } = useVideoConfig();
	const frame = useCurrentFrame();
	const fontFamily = GaretHeavyFont;

	const getEnter = (startInSeconds: number) =>
		spring({
			frame: frame - Math.round(startInSeconds * fps),
			fps,
			config: { damping: 200 },
			durationInFrames: 20,
		});

	const getFittedAnswerSize = (answer: string) => {
		const fittedTest = fitText({
			fontFamily,
			text: answer,
			withinWidth: 835,
		});
		return Math.min(50, fittedTest.fontSize);
	};

	if (questions.length === 0) {
		return null;
	}

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
			<div style={{ color, textTransform: 'uppercase', marginBottom: 10 }}>
				{title}
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: gap ?? 5 }}>
				{questions.map((question, index) => {
					return (
						<div
							key={index}
							style={{ display: 'flex', gap: 60, height: 60, marginLeft: 16 }}
						>
							<span
								style={{
									fontSize: 22,
									color: '#DEDACE',
									alignSelf: 'center',
									width: 25,
								}}
							>
								{startIndex + index + 1}
							</span>
							<BasicQuizQuestionMarker question={question} />
							<div style={{ position: 'relative' }}>
								<Sequence name="Answer" from={question.answerInSeconds * fps}>
									<div
										style={{
											transform: `scale(${getEnter(question.answerInSeconds)})`,
											textWrap: 'nowrap',
											fontSize: getFittedAnswerSize(question.answer),
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<span>{question.answer.replace('.', '')}</span>
									</div>
								</Sequence>
								{question.audios.map((audio, audioIndex) => {
									return (
										<Sequence
											key={audioIndex}
											name="Question Audio"
											from={Math.round((audio.startInSeconds ?? 0) * fps)}
											durationInFrames={Math.ceil(
												audio.durationInSeconds * fps,
											)}
										>
											<Audio src={audio.audioUrl} />
										</Sequence>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
