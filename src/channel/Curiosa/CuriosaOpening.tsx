import { CuriosaLogo } from './CuriosaLogo';

type CuriosaOpeningProps = {
	duration: number;
};

export const CuriosaOpening: React.FC<CuriosaOpeningProps> = ({ duration }) => {
	return <CuriosaLogo direction="in" top={1000} from={0} duration={duration} />;
};
