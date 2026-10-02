import {
	RankingTextOverlay,
	RankingTextOverlayProps,
} from './RankingTextOverlay';

type RankingTextOverlayContainerProps = {
	overlays: RankingTextOverlayProps[];
};

export const RankingTextOverlayContainer: React.FC<
	RankingTextOverlayContainerProps
> = ({ overlays }) => {
	if (!overlays) {
		return null;
	}

	return overlays.map((overlay, index) => {
		return (
			<div key={index}>
				<RankingTextOverlay {...overlay} />
			</div>
		);
	});
};
