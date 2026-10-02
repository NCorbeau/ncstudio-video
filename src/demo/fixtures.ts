import { staticFile } from 'remotion';
import { BasicQuizProps } from '../BasicQuiz/BasicQuiz';
import { RankingProps } from '../Ranking/Ranking';
import { demoAudio } from './audio';

// These inputs exercise the original renderer with redistributable demo media.
// Narration has real audio and explicit word boundaries; no private data is needed.
const audio = (name: keyof typeof demoAudio) => ({
	...demoAudio[name],
	audioUrl: staticFile(demoAudio[name].audioUrl),
});

const footage = (name: string) => staticFile(`demo/${name}.mp4`);

export const basicQuizDemo: BasicQuizProps = {
	quizName: 'Solar System',
	introAudio: audio('quiz-intro'),
	outroAudio: audio('quiz-outro'),
	introBgUrl: footage('orbit-teal'),
	outroBgUrl: footage('orbit-blue'),
	questions: [
		{
			answer: 'Mars',
			audios: [audio('quiz-q1'), audio('quiz-a1'), audio('quiz-c1')],
			bgUrl: footage('orbit-teal'),
		},
		{
			answer: 'Saturn',
			audios: [audio('quiz-q2'), audio('quiz-a2'), audio('quiz-c2')],
			bgUrl: footage('orbit-violet'),
		},
		{
			answer: 'The Sun',
			audios: [audio('quiz-q3'), audio('quiz-a3'), audio('quiz-c3')],
			bgUrl: footage('orbit-blue'),
		},
	],
};

const shot = (name: string, duration: number) => ({
	videos: [{
		videoUrl: footage(name),
		startInSeconds: 0,
		durationInSeconds: duration,
		size: { width: 1080, height: 1920 },
		position: { x: 0, y: 0 },
		muted: true,
	}],
});

export const rankingDemo: RankingProps = {
	subject: 'Three building blocks of video automation',
	topics: [
		{
			name: 'Reusable scenes',
			number: 3,
			text: 'Consistent visuals, reusable building blocks.',
			audio: audio('ranking-three'),
			shots: [shot('orbit-teal', demoAudio['ranking-three'].durationInSeconds)],
		},
		{
			name: 'Word captions',
			number: 2,
			text: 'Readable captions from explicit word timings.',
			audio: audio('ranking-two'),
			shots: [shot('orbit-violet', demoAudio['ranking-two'].durationInSeconds)],
		},
		{
			name: 'Shared timeline',
			number: 1,
			text: 'Sound and picture, sequenced together.',
			audio: audio('ranking-one'),
			shots: [shot('orbit-blue', demoAudio['ranking-one'].durationInSeconds)],
		},
	],
	closing: {
		audio: audio('ranking-closing'),
		text: 'Three building blocks. One repeatable pipeline.',
	},
};

export const captionedVideoDemo = {
	src: footage('captioned-video'),
};
