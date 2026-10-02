import { AbsoluteFill, Sequence } from 'remotion';
import { MontserratFont } from '../loadRankingFont';
import { Animated, Fade } from 'remotion-animated';
import React, { CSSProperties, useContext } from 'react';
import { Duration } from '../../common/types/Duration';
import { RankingContext } from '../RankingContext';

export type RankingTextOverlayProps = {
	readonly duration: Duration;
	readonly top: number;
	readonly text?: string;
	readonly title?: string;
	readonly number?: number;
	readonly references?: string;
};

const styles = {
	container: {
		backgroundColor: 'rgba(11, 11, 11, 0.5)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '80px 140px',
		// paddingBottom: 150,
		// height: 450,
		width: '100%',
	} satisfies CSSProperties,
	content: {
		position: 'relative' as const,
		width: '100%',
		maxWidth: 900,
	} satisfies CSSProperties,
	number: {
		fontFamily: MontserratFont,
		fontSize: 44,
		fontWeight: 700,
		color: '#6c5ce7',
		marginBottom: 20,
	} satisfies CSSProperties,
	text: {
		fontFamily: MontserratFont,
		fontSize: 48,
		fontWeight: 700,
		color: '#ffffff',
		lineHeight: 1.3,
	} satisfies CSSProperties,
	references: {
		// position: 'absolute' as const,
		// left: 0,
		// bottom: -100,
		marginTop: 40,
		fontFamily: MontserratFont,
		fontSize: 32,
		color: '#CCCCCC',
	} satisfies CSSProperties,
};

export const RankingTextOverlay: React.FC<RankingTextOverlayProps> = ({
	text,
	title,
	duration,
	top,
	number,
	references,
}) => {
	const { topics } = useContext(RankingContext);

	if ((!text && !title) || !duration) {
		return null;
	}

	return (
		<AbsoluteFill>
			<Sequence
				from={Math.round(duration.start)}
				durationInFrames={Math.max(
					1,
					Math.ceil(duration.end) - Math.round(duration.start) + 30,
				)}
			>
				<Animated
					absolute
					style={{ ...styles.container, opacity: 0, marginTop: top }}
					animations={[
						Fade({ initial: 0, start: 30, duration: 15, to: 1 }),
						Fade({
							initial: 1,
							start: duration.end - duration.start,
							duration: 15,
							to: 0,
						}),
					]}
				>
					<div
						style={{
							...styles.content,
						}}
					>
						{number !== undefined && (
							<div style={styles.number}>
								{number} /{' '}
								{topics.filter((topic) => topic.number !== undefined).length}
							</div>
						)}
						{title && (
							<div style={{ ...styles.number, color: '#ffffff' }}>{title}</div>
						)}
						{text && (
							<div style={{ ...styles.text, fontSize: !number ? 72 : 48 }}>
								{text}
							</div>
						)}
						{references && <div style={styles.references}>{references}</div>}
					</div>
				</Animated>
			</Sequence>
		</AbsoluteFill>
	);
};
