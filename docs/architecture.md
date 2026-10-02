# Renderer architecture

## Data flow

A producer supplies structured narration, word timestamps and media locations. The
renderer validates that input, builds a timeline, then turns timeline offsets into
Remotion sequences. The same composition tree is used in Studio, local MP4 rendering
and optional Lambda rendering.

```text
Narration + word timings + media + composition-specific content
                       |
                Runtime input schema
                       |
          Quiz / ranking timeline calculation
                       |
     Audio + captions + footage + overlays + progress
                       |
              Remotion frame sequences
                       |
                  Portrait MP4
```

Upstream speech generation, content selection and publishing are separate concerns.
The renderer consumes their output rather than embedding provider credentials or a
particular automation account into the React components.

## Narrated audio contract

Quiz and ranking narration uses this shape:

```ts
{
  audioUrl: string;
  durationInSeconds: number;
  captions: Array<{
    text: string;
    startInSeconds: number;
    endInSeconds: number;
  }>;
}
```

Times are relative to the individual audio clip. The timeline offsets them into the
composition. Captions must be ordered, contain finite nonnegative times and remain
within the clip duration. Rendered sequences use frame offsets at the composition's
frame rate. Demo narration and its timing data live together in `src/demo` and
`public/demo`.

## Quiz timeline

`BasicQuizTimeline` lays out intro, question narration, a bounded thinking interval,
answer narration, optional commentary and outro. `BasicQuizQuestionsProcessor`
selects questions that fit the short's time budget. The answer reveal and progress
bar refer to the same calculated timeline. Background media can cover the whole
short or individual sections.

The 2026 repairs make audio playback duration match the full clip, align captions
with the audio start, account for thinking time in question visibility, and reject
inputs that cannot fit the budget. The supported fixture exercises multiple questions
and an optional comment rather than only a title animation.

## Ranking timeline

`RankingTimeline` lays out an intro, ranked topics separated by a gap, then a closing
narration and summary. Each topic can contain multiple shots; a shot can itself
contain multiple concurrent videos. A topic lasts long enough for both its narration
and visual media. Caption offsets and overlay timing derive from the topic's start.

The 2026 repairs align the runtime schema with the actual topic model and keep each
video's offset and duration intact when there are multiple videos in a shot. Topic
media and narration can have different lengths; this is covered by focused tests.

## Captioned video

`CaptionedVideo` measures the bundled source video's duration and reads a same-basename
JSON sidecar. The sidecar contains `transcription`, an array of `{text,
startInSeconds}` entries. It is the legacy Whisper conversion format, distinct from
the narrated-audio contract above. Local sidecar changes are observed in Studio.

A missing sidecar leaves an explanatory state rather than an indefinitely blocked
render. Invalid sidecars and failed media/font loading surface render errors. Each
caption sequence rounds timing to frames and ends at the next entry or its display
limit.

## Public and private integration

Public source contains the original rendering logic, generic cloud/subtitle tooling,
licensed replacement fonts and self-contained demo props/media. Production content,
original assets, account-specific deployments and original history belong in the
private companion.

For local integration, keep props under `private-inputs/` and assets under
`public/private/`; Git ignores both. Supply props explicitly when rendering. Git ignore rules control commits, not Remotion bundles: the entire `public/` directory
is included in a bundle. Use a clean checkout and an explicit asset set for cloud
deployment so local private media is uploaded only when intended. Cloud
rendering reads `REMOTION_SITE_URL` from the environment. No private package or repo
is needed to render the bundled examples.

## Verification boundary

`npm run check` validates source and the bundle; focused tests exercise schema and
timeline invariants. CI additionally renders all bundled compositions at reduced
resolution. Rendered output should also be inspected for caption/readability and
layout. The optional AWS deployment and Whisper transcription paths are retained as
generic integrations; a local demo render does not establish that a live deployment
or transcription model has been exercised.
