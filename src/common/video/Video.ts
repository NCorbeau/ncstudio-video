import { VideoPosition } from './VideoPosition';
import { VideoSize } from './VideoSize';

export type Video = {
	videoUrl: string;
	startInSeconds: number;
	durationInSeconds: number;
	size: VideoSize;
	position: VideoPosition;
	muted: boolean;
	brightness?: number;
};
