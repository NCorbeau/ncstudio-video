import { CSSProperties } from 'react';
import { AbsoluteFill } from 'remotion';
import { MontserratBoldFont } from '../../Ranking/loadRankingFont';

type CuriosaCornerLogoProps = {
	position?: {
		bottom?: number;
		left?: number;
	};
	scale?: number;
};

const styles = {
	container: {
		display: 'flex',
		pointerEvents: 'none',
	} satisfies CSSProperties,
	geometricContainer: {
		position: 'absolute' as const,
		width: 200,
		height: 200,
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
		top: '50%',
	} satisfies CSSProperties,
	logo: {
		fontFamily: MontserratBoldFont,
		fontSize: 36,
		fontWeight: 700,
		color: '#ffffff',
	} satisfies CSSProperties,
};

export const CuriosaCornerLogo: React.FC<CuriosaCornerLogoProps> = ({
	position = { bottom: 1550, left: 100 },
	scale = 0.8,
}) => {
	return (
		<AbsoluteFill style={styles.container}>
			<div
				style={{
					...styles.geometricContainer,
					bottom: position.bottom,
					left: position.left,
					transform: `scale(${scale})`,
					transformOrigin: 'bottom left',
				}}
			>
				{/* Outer Hexagon */}
				<svg viewBox="0 0 400 400" style={styles.svg}>
					<polygon
						points="100,40 300,40 400,200 300,360 100,360 0,200"
						fill="#6c5ce7"
						fillOpacity="0.1"
					/>
				</svg>

				{/* Middle Hexagon */}
				<svg viewBox="0 0 400 400" style={styles.svg}>
					<polygon
						points="120,80 280,80 360,200 280,320 120,320 40,200"
						fill="#6c5ce7"
						fillOpacity="0.3"
					/>
				</svg>

				{/* Inner Hexagon */}
				<svg viewBox="0 0 400 400" style={styles.svg}>
					<polygon
						points="140,120 260,120 320,200 260,280 140,280 80,200"
						fill="#6c5ce7"
					/>
				</svg>

				{/* Logo */}
				<div style={styles.logoContainer}>
					<span style={styles.logo}>curiosa</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};
