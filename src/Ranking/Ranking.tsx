import React, { useEffect, useMemo, useState } from 'react';
import {
	AbsoluteFill,
	cancelRender,
	continueRender,
	delayRender,
	useVideoConfig,
} from 'remotion';
import { RankingContext } from './RankingContext';
import { RankingTimeline } from './RankingTimeline';
import { loadRankingFont } from './loadRankingFont';
import { RankingBackgroundContainer } from './background/RankingBackgroundContainer';
import { BackgroundWithTime } from '../common/background/BackgroundWithTime';
import { RankingTopic, RankingTopics } from './topics/RankingTopics';
import { CuriosaOpening } from '../channel/Curiosa/CuriosaOpening';
import { RankingCuriosaClosing } from './RankingCuriosaClosing';
import { CaptionedAudio } from '../common/audio/CaptionedAudio';
import { RankingCaptionContainer } from './captions/RankingCaptionContainer';
import { RankingTextOverlayContainer } from './overlay/RankingTextOverlayContainer';

export type RankingProps = {
	readonly subject: string;
	readonly topics: RankingTopic[];
	readonly closing: RankingClosing;
};

export type RankingClosing = {
	audio: CaptionedAudio;
	text?: string;
};

export const Ranking: React.FC<RankingProps> = ({
	subject,
	topics,
	closing,
}) => {
	const [handle] = useState(() => delayRender());
	const timeline = useMemo(
		() => new RankingTimeline(topics, closing),
		[topics, closing],
	);
	const [initialized, setInitialized] = useState(false);
	const { fps } = useVideoConfig();
	useEffect(() => {
		loadRankingFont()
			.then(() => {
				setInitialized(true);
				continueRender(handle);
			})
			.catch(cancelRender);
	}, [handle]);

	const getBackgrounds = (): BackgroundWithTime[] => {
		return timeline!.getBackgroundSequences().map((sequence) => {
			return {
				bgStartInSeconds: sequence.startInSeconds,
				bgDurationInSeconds: sequence.durationInSeconds ?? 60,
				bgUrl: sequence.bgUrl!,
			};
		});
	};

	if (!initialized || !timeline) {
		return null;
	}

	return (
		<RankingContext.Provider value={{ timeline, topics }}>
			<AbsoluteFill aria-label={subject} style={{ backgroundColor: '#111111' }}>
				<RankingBackgroundContainer backgrounds={getBackgrounds()} />

				<RankingCuriosaClosing
					start={
						timeline.getTotalDurationInSeconds() - timeline.getClosingDuration()
					}
					duration={timeline.getClosingDuration()}
					audio={timeline.getClosingAudioWithAdjustedTime()}
					text={closing.text}
				/>

				<RankingTopics topics={topics} />

				<CuriosaOpening duration={RankingTimeline.INTRO_DURATION} />

				<RankingTextOverlayContainer
					overlays={timeline.getTextOverlays(topics, fps)}
				/>

				<RankingCaptionContainer
					captionBlocks={timeline.getCaptionSequences(topics)}
				/>
			</AbsoluteFill>
		</RankingContext.Provider>
	);
};
