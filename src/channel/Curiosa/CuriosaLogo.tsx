import { CSSProperties } from 'react';
import {
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Sequence,
	AbsoluteFill,
} from 'remotion';
import { MontserratBoldFont } from '../../Ranking/loadRankingFont';

type AnimationDirection = 'in' | 'out';

type CuriosaLogoProps = {
	duration: number;
	direction?: AnimationDirection;
	from?: number;
	top?: number;
	timing?: {
		hexagonDelay?: number;
		hexagonDuration?: number;
		logoDelay?: number;
		logoDuration?: number;
	};
};

const styles = {
	container: {
		backgroundColor: '#111111',
		display: 'flex',
		alignItems: 'center',
	} satisfies CSSProperties,
	geometricContainer: {
		position: 'relative' as const,
		width: 400,
		height: 400,
	} satisfies CSSProperties,
	svg: {
		position: 'absolute' as const,
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
	} satisfies CSSProperties,
	logoContainer: {
		position: 'absolute' as const,
		width: '100%',
		textAlign: 'center' as const,
	} satisfies CSSProperties,
	logo: {
		fontFamily: MontserratBoldFont,
		fontSize: 72,
		fontWeight: 700,
		color: '#ffffff',
	} satisfies CSSProperties,
};

export const CuriosaLogo: React.FC<CuriosaLogoProps> = ({
	duration,
	direction = 'in',
	from = 0,
	top = 0,
	timing = {
		hexagonDelay: 5,
		hexagonDuration: 15,
		logoDelay: 30,
		logoDuration: 15,
	},
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const {
		hexagonDelay = 5,
		hexagonDuration = 15,
		logoDelay = 30,
		logoDuration = 15,
	} = timing;

	const currentFrame = frame - from;

	const hexagonOpacity = (index: number) => {
		const delay = index * hexagonDelay;

		if (direction === 'in') {
			return interpolate(
				currentFrame - delay,
				[0, hexagonDuration, logoDelay + logoDuration, duration * fps],
				[0, 1, 1, 1],
				{
					extrapolateRight: 'clamp',
				},
			);
		}
		return interpolate(currentFrame, [0, duration * fps], [1, 0], {
			extrapolateRight: 'clamp',
		});
	};

	const logoOpacity = interpolate(
		currentFrame,
		direction === 'in'
			? [logoDelay, logoDelay + logoDuration]
			: [0, duration * fps],
		direction === 'in' ? [0, 1] : [1, 0],
		{
			extrapolateRight: 'clamp',
		},
	);

	const logoPosition = interpolate(
		currentFrame,
		direction === 'in'
			? [logoDelay, logoDelay + logoDuration]
			: [0, duration * fps],
		direction === 'in' ? [20, 0] : [0, 20],
		{
			extrapolateRight: 'clamp',
		},
	);

	return (
		<Sequence from={from} durationInFrames={duration * fps}>
			<AbsoluteFill style={styles.container}>
				<div style={{ ...styles.geometricContainer, marginTop: `${top}px` }}>
					{/* Outer Hexagon */}
					<svg
						viewBox="0 0 400 400"
						style={{ ...styles.svg, opacity: hexagonOpacity(0) }}
					>
						<polygon
							points="100,40 300,40 400,200 300,360 100,360 0,200"
							fill="#6c5ce7"
							fillOpacity="0.1"
						/>
					</svg>

					{/* Middle Hexagon */}
					<svg
						viewBox="0 0 400 400"
						style={{ ...styles.svg, opacity: hexagonOpacity(1) }}
					>
						<polygon
							points="120,80 280,80 360,200 280,320 120,320 40,200"
							fill="#6c5ce7"
							fillOpacity="0.3"
						/>
					</svg>

					{/* Inner Hexagon */}
					<svg
						viewBox="0 0 400 400"
						style={{ ...styles.svg, opacity: hexagonOpacity(2) }}
					>
						<polygon
							points="140,120 260,120 320,200 260,280 140,280 80,200"
							fill="#6c5ce7"
						/>
					</svg>

					{/* Logo */}
					<div
						style={{
							...styles.logoContainer,
							opacity: logoOpacity,
							transform: `translateY(${logoPosition}px)`,
							top: '50%',
						}}
					>
						<span style={styles.logo}>curiosa</span>
					</div>
				</div>
			</AbsoluteFill>
		</Sequence>
	);
};
