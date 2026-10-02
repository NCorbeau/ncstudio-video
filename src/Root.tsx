import { Composition } from 'remotion';
import {
	CaptionedVideo,
	calculateCaptionedVideoMetadata,
	captionedVideoSchema,
} from './CaptionedVideo';
import { BasicQuiz } from './BasicQuiz/BasicQuiz';
import { calculateBasicQuizMetadata } from './BasicQuiz/calculateBasicQuizMetadata';
import { basicQuizSchema } from './BasicQuiz/basicQuizSchema';
import { Ranking } from './Ranking/Ranking';
import { calculateRankingMetadata } from './Ranking/calculateRankingMetadata';
import { rankingSchema } from './Ranking/rankingSchema';
import { basicQuizDemo, captionedVideoDemo, rankingDemo } from './demo/fixtures';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition
			id="CaptionedVideo"
			component={CaptionedVideo}
			calculateMetadata={calculateCaptionedVideoMetadata}
			schema={captionedVideoSchema}
			width={1080}
			height={1920}
			defaultProps={captionedVideoDemo}
		/>
		<Composition
			id="BasicQuiz"
			component={BasicQuiz}
			calculateMetadata={calculateBasicQuizMetadata}
			schema={basicQuizSchema}
			width={1080}
			height={1920}
			defaultProps={basicQuizDemo}
		/>
		<Composition
			id="Ranking"
			component={Ranking}
			calculateMetadata={calculateRankingMetadata}
			schema={rankingSchema}
			width={1080}
			height={1920}
			defaultProps={rankingDemo}
		/>
	</>
);
