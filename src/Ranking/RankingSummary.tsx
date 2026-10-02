import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { Animated, Fade } from 'remotion-animated';
import React, { CSSProperties, useContext } from 'react';
import { MontserratFont } from './loadRankingFont';
import { RankingContext } from './RankingContext';
import { Duration } from '../common/types/Duration';

type RankingSummaryProps = {
	readonly duration: Duration;
	readonly top: number;
};

const styles = {
	container: {
		backgroundColor: 'rgba(11, 11, 11, 0.7)',
		display: 'flex',
		alignItems: 'flex-start',
		justifyContent: 'center',
		padding: '80px 120px',
		width: '100%',
		marginTop: 50,
	} satisfies CSSProperties,
	content: {
		width: '100%',
		maxWidth: 900,
	} satisfies CSSProperties,
	title: {
		fontFamily: MontserratFont,
		fontSize: 54,
		fontWeight: 700,
		color: '#6c5ce7',
		marginBottom: 50,
	} satisfies CSSProperties,
	topicList: {
		display: 'flex',
		flexDirection: 'column',
		gap: 35,
	} satisfies CSSProperties,
	topicItem: {
		display: 'flex',
		alignItems: 'flex-start',
		gap: 35,
	} satisfies CSSProperties,
	number: {
		fontFamily: MontserratFont,
		fontSize: 44,
		fontWeight: 700,
		color: '#6c5ce7',
		minWidth: 35,
	} satisfies CSSProperties,
	text: {
		fontFamily: MontserratFont,
		fontSize: 42,
		fontWeight: 500,
		color: '#ffffff',
		lineHeight: 1.3,
	} satisfies CSSProperties,
};

export const RankingSummary: React.FC<RankingSummaryProps> = ({
	duration,
	top,
}) => {
	const { timeline, topics } = useContext(RankingContext);
	const frame = useCurrentFrame() - Math.round(duration.start);

	if (!timeline) {
		return null;
	}

	const staggerDelay = 5; // Frames between each topic animation

	const getTopics = () => {
		const allTopicsAreWithoutNumber = !topics.some((topic) =>
			Boolean(topic.number),
		);
		return topics.filter(
			(topic) => Boolean(topic.number) || allTopicsAreWithoutNumber,
		);
	};

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
					animations={[Fade({ initial: 0, start: 30, duration: 15, to: 1 })]}
				>
					<div style={styles.content}>
						<div style={styles.title}>Summary</div>
						<div style={styles.topicList}>
							{getTopics().map((topic, index) => {
								const delay = index * staggerDelay;
								const opacity = interpolate(
									frame,
									[delay, delay + 15],
									[0, 1],
									{
										extrapolateLeft: 'clamp',
										extrapolateRight: 'clamp',
									},
								);
								const translateY = interpolate(
									frame,
									[delay, delay + 15],
									[20, 0],
									{
										extrapolateLeft: 'clamp',
										extrapolateRight: 'clamp',
									},
								);

								return (
									<div
										key={index}
										style={{
											...styles.topicItem,
											opacity,
											transform: `translateY(${translateY}px)`,
										}}
									>
										<div style={styles.number}>
											{topic.number ?? index + 1}.
										</div>
										<div style={styles.text}>{topic.text ?? topic.name}</div>
									</div>
								);
							})}
						</div>
					</div>
				</Animated>
			</Sequence>
		</AbsoluteFill>
	);
};
