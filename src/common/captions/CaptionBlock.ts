import { Caption } from './Caption';

export type CaptionBlock = {
	startInSeconds: number;
	endInSeconds: number;
	captions: Caption[];
};
