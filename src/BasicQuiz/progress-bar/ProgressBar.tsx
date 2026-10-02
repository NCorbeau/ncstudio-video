import './ProgressBar.css';

export type ProgressBarProps = {
	progress: number;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
	return (
		<div className="container">
			<div className="progress progress-striped">
				<div style={{ width: `${progress}%` }} className="progress-bar" />
			</div>
		</div>
	);
};
