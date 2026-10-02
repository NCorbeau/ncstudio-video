import { spawnSync } from 'node:child_process';

const siteUrl = process.env.REMOTION_SITE_URL;
if (!siteUrl || !URL.canParse(siteUrl) || new URL(siteUrl).protocol !== 'https:') {
  console.error('Set REMOTION_SITE_URL to your deployed HTTPS Remotion site URL.');
  process.exit(1);
}
const result = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['remotion', 'lambda', 'render', siteUrl, 'BasicQuiz', ...process.argv.slice(2)],
  { stdio: 'inherit', shell: false },
);
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
