import React from 'react';
import { AbsoluteFill } from 'remotion';
import { GaretBookFont, NullFont } from './loadBasicQuizFonts';

export interface BasicQuizNameProps {
	readonly quizName: string;
}

const fontFamily = NullFont;

export const BasicQuizName: React.FC<BasicQuizNameProps> = ({ quizName }) => {
	const fontSize = 100;

	return (
		<AbsoluteFill
			style={{
				width: '100%',
				top: 150,
			}}
		>
			<AbsoluteFill
				style={{
					display: 'flex',
					backgroundColor: '#1B003D',
					left: '50%',
					transform: 'translate(-50%)',
					alignItems: 'center',
					justifyContent: 'center',
					height: 300,
					width: '80%',
					borderRadius: 50,
				}}
			>
				<div
					style={{
						fontSize,
						fontFamily,
						color: '#DEDACE',
						textAlign: 'center',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						padding: 40,
						justifyContent: 'center',
						lineHeight: 1.3,
					}}
				>
					<div>quizorama</div>
					<div
						style={{
							fontSize: 60,
							fontFamily: GaretBookFont,
							textTransform: 'uppercase',
						}}
					>
						{quizName}
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
