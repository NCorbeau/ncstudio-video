import assert from 'node:assert/strict';
import test from 'node:test';
import { BasicQuizTimeline } from '../src/BasicQuiz/BasicQuizTimeline';
import { BasicQuizQuestionsProcessor } from '../src/BasicQuiz/questions/BasicQuizQuestionsProcessor';
import { RankingTimeline } from '../src/Ranking/RankingTimeline';
import { audioSchema } from '../src/common/audio/audioSchema';
import { basicQuizSchema } from '../src/BasicQuiz/basicQuizSchema';
import { rankingSchema } from '../src/Ranking/rankingSchema';
import {
	CaptionedAudioUtils,
	type CaptionedAudio,
} from '../src/common/audio/CaptionedAudio';
import type { Video } from '../src/common/video/Video';

const audio = (durationInSeconds = 2): CaptionedAudio => ({
	audioUrl: 'demo.wav',
	durationInSeconds,
	captions: [
		{
			startInSeconds: 0.2,
			endInSeconds: durationInSeconds - 0.1,
			text: 'demo',
		},
	],
});
const video = (durationInSeconds = 2, startInSeconds = 0): Video => ({
	videoUrl: 'demo.mp4',
	durationInSeconds,
	startInSeconds,
	position: { x: 0, y: 0 },
	size: { width: 1080, height: 1920 },
	muted: true,
});

test('quiz keeps audio and captions aligned, preserves leading silence, and counts the answer pause', () => {
	const intro = audio();
	const question = { answer: 'answer', audios: [audio(), audio(), audio()] };
	const timeline = new BasicQuizTimeline(intro, audio(), [question]);
	const timed = timeline.getQuestionWithTime(question);
	assert.equal(timed.startInSeconds, 2.5);
	assert.equal(timed.audios[0].startInSeconds, 2.5);
	assert.equal(timed.audios[0].captions[0].startInSeconds, 2.7);
	assert.equal(timed.audios[0].durationInSeconds, 2);
	assert.equal(timed.answerInSeconds, 7.5);
	assert.equal(timed.durationInSeconds, 9);
	const bar = timeline.progressBarSequences[0];
	assert.equal(
		bar.startInSeconds + bar.durationInSeconds!,
		timed.answerInSeconds,
	);
	assert.equal(
		timeline.getInterludeAudioWithTime(intro, 'intro').startInSeconds,
		0,
	);
	assert.equal(timeline.getTotalDurationInSeconds(), 14.5);
});

test('quiz drops optional comments before dropping questions, fits 60 seconds, and cannot silently produce an empty quiz', () => {
	const questions = Array.from({ length: 5 }, () => ({
		answer: 'answer',
		audios: [audio(5), audio(5), audio(5)],
	}));
	const fitted = BasicQuizQuestionsProcessor.processQuestions(
		questions,
		audio(),
		audio(),
	);
	assert.equal(fitted.length, 4);
	assert.ok(fitted.every((question) => question.audios.length === 2));
	assert.ok(
		new BasicQuizTimeline(
			audio(),
			audio(),
			fitted,
		).getTotalDurationInSeconds() <= 60,
	);
	assert.equal(
		questions[0].audios.length,
		3,
		'processing must not mutate input',
	);
	assert.throws(
		() => BasicQuizQuestionsProcessor.processQuestions([], audio(), audio()),
		/at least one question/,
	);
	assert.throws(
		() =>
			BasicQuizQuestionsProcessor.processQuestions(
				[{ answer: 'too long', audios: [audio(40), audio(40)] }],
				audio(),
				audio(),
			),
		/too long/,
	);
});

test('answer budget includes every scheduled gap and never creates negative countdowns', () => {
	const question = { answer: 'answer', audios: [audio(27), audio(27)] };
	const fitted = BasicQuizQuestionsProcessor.processQuestions(
		[question],
		audio(1),
		audio(1),
	);
	const timeline = new BasicQuizTimeline(audio(1), audio(1), fitted);
	assert.equal(timeline.getTotalDurationInSeconds(), 60);
	assert.ok(timeline.progressBarSequences[0].durationInSeconds! > 0);
	assert.throws(
		() =>
			new BasicQuizTimeline(audio(), audio(), [
				{ answer: 'long', audios: [audio(40), audio(40)] },
			]),
		/cannot fit/,
	);
});

test('ranking offsets each shot once and keeps simultaneous clips together', () => {
	const topic = {
		name: 'topic',
		audio: audio(10),
		shots: [{ videos: [video(3), video(2, 1)] }, { videos: [video(2)] }],
	};
	const timeline = new RankingTimeline([topic], { audio: audio() });
	const first = timeline.getShotVideosWithAdjustedTime(topic, 0);
	const second = timeline.getShotVideosWithAdjustedTime(topic, 1);
	assert.deepEqual(
		first.map((clip) => clip.startInSeconds),
		[2, 3],
	);
	assert.deepEqual(
		first.map((clip) => clip.durationInSeconds),
		[3, 2],
	);
	assert.equal(second[0].startInSeconds, 5);
	assert.equal(
		second[0].durationInSeconds,
		8.5,
		'final footage covers narration and inter-topic gap',
	);
	assert.equal(timeline.getClosingAudioWithAdjustedTime().startInSeconds, 13.5);
	assert.equal(timeline.getTotalDurationInSeconds(), 23.5);
	assert.equal(
		topic.shots[1].videos[0].startInSeconds,
		0,
		'timeline must not mutate input',
	);
	assert.throws(
		() => timeline.getShotVideosWithAdjustedTime(topic, 3),
		/not part/,
	);
});

test('audio frame ranges use the whole clip instead of word timestamps', () => {
	assert.deepEqual(
		CaptionedAudioUtils.getAudioDuration(
			{ ...audio(), startInSeconds: 1.25 },
			30,
		),
		{ start: 38, end: 98 },
	);
});

test('audio schema rejects missing, backwards, out-of-range and unordered timestamps', () => {
	assert.equal(audioSchema.safeParse(audio()).success, true);
	const invalid = [
		{ ...audio(), captions: [] },
		{ ...audio(), durationInSeconds: 0 },
		{ ...audio(), captions: [{ startInSeconds: 0, text: 'missing end' }] },
		{
			...audio(),
			captions: [{ startInSeconds: 1, endInSeconds: 0, text: 'backwards' }],
		},
		{
			...audio(),
			captions: [{ startInSeconds: 0, endInSeconds: 3, text: 'too long' }],
		},
		{
			...audio(),
			captions: [
				{ startInSeconds: 1, endInSeconds: 1.5, text: 'second' },
				{ startInSeconds: 0, endInSeconds: 0.5, text: 'first' },
			],
		},
	];
	for (const props of invalid)
		assert.equal(audioSchema.safeParse(props).success, false);
});

test('quiz schema requires questions with exactly two or three narrated clips', () => {
	const props = {
		quizName: 'demo',
		introAudio: audio(),
		outroAudio: audio(),
		questions: [{ answer: 'demo', audios: [audio(), audio()] }],
	};
	assert.equal(basicQuizSchema.safeParse(props).success, true);
	assert.equal(
		basicQuizSchema.safeParse({ ...props, questions: [] }).success,
		false,
	);
	assert.equal(
		basicQuizSchema.safeParse({
			...props,
			questions: [{ answer: 'demo', audios: [audio()] }],
		}).success,
		false,
	);
	assert.equal(
		basicQuizSchema.safeParse({ ...props, bgUrls: [] }).success,
		false,
	);
});

test('ranking schema matches the original topic-level audio model and preserves overlays', () => {
	const props = {
		subject: 'demo',
		topics: [
			{
				name: 'one',
				audio: audio(),
				shots: [{ videos: [video()] }],
				number: 1,
				text: 'description',
				references: 'source',
			},
		],
		closing: { audio: audio() },
	};
	const parsed = rankingSchema.parse(props);
	assert.equal(parsed.topics[0].text, 'description');
	assert.equal(parsed.topics[0].audio.audioUrl, 'demo.wav');
	assert.equal(
		rankingSchema.safeParse({
			...props,
			topics: [
				{ name: 'broken', shots: [{ audio: audio(), videos: [video()] }] },
			],
		}).success,
		false,
	);
	assert.equal(
		rankingSchema.safeParse({ ...props, topics: [] }).success,
		false,
	);
});

test('subtitle sidecars accept legacy start-only words and explicit ends, rejecting malformed order', async () => {
	const { subtitleFileSchema } = await import(
		'../src/CaptionedVideo/subtitleSchema'
	);
	assert.equal(
		subtitleFileSchema.safeParse({
			transcription: [
				{ startInSeconds: 0.2, text: 'legacy' },
				{ startInSeconds: 1, endInSeconds: 1.5, text: 'timed' },
			],
		}).success,
		true,
	);
	assert.equal(
		subtitleFileSchema.safeParse({
			transcription: [
				{ startInSeconds: 1, text: 'second' },
				{ startInSeconds: 0, text: 'first' },
			],
		}).success,
		false,
	);
	assert.equal(
		subtitleFileSchema.safeParse({
			transcription: [
				{ startInSeconds: 1, endInSeconds: 0, text: 'backwards' },
			],
		}).success,
		false,
	);
});
