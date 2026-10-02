# Publication notes

This public edition is a fresh reviewed source snapshot of the original 2024–2025 renderer,
with 2026 repairs and replacement demo assets. It is intentionally separate from the
private repository that preserves the original commit history and production material.

## Included material

- Original React/TypeScript compositions, timing logic and generic render tooling.
- Small 2026 demo inputs and generated geometric graphics/video.
- Bundled synthetic narration and timestamp data; see
  [media provenance](public/demo/PROVENANCE.md).
- Licensed replacement fonts, with the license bundled alongside the font files.

The demo fixtures are replacements for historical media and production inputs. Their
presence does not grant a license to the historical assets or imply that these exact
outputs shipped in 2024. No new license for the original application source is assigned
by this preparation; third-party assets retain their own terms.

## Private boundary

Keep credentials, production props, original voice/music/video assets and deployment
settings in the private companion, local ignored directories or a secret store.
`.gitignore` excludes local environment files, private props/media, downloaded speech
models and render outputs. Review new media rights and check staged files before each
publication. Ignoring or removing a file does not remove existing copies from history.

## Verification

Use `npm ci`, `npm run check` and local renders of all bundled compositions before
publishing a change. The dependency tree was upgraded together to Remotion 4.0.532;
`npm audit` reported zero known vulnerabilities on 2 October 2026. That result is a
point-in-time dependency advisory check, not a complete security audit.

Local demo rendering needs no cloud account. Optional deployment commands are explicit
and can create billable resources. Live AWS deployment and Whisper transcription are
not part of the local-demo verification.
