# Course screenshots

Real app screens help learners find a control at its first introduction. Keep captions short, write descriptive alt text, and use numbered annotations that leave the controls readable. Lessons link to `../../screenshots/m<module>/<lesson-slug>/<name>.png`; the site serves that same version and lets readers enlarge it.

## Capture and privacy

- Capture the actual app. Never invent a screen or present a demo as a learner session.
- Crop unrelated content. Blur names, project names, account details, paths and other private information before adding the file to the repository. Inspect the final image at full size; remove metadata.
- Keep the control, its label and enough surrounding context to locate it. When joining separate crops, label that clearly.
- Record the capture date, app/platform and limits. A screenshot of an installed app does not prove a fresh installation or successful build. Update the lesson's `updated:` date when replacing a capture.
- Use PNG, usually 1200–1600 pixels wide. Keep raw captures outside the repository.

## Current images

| Folder | What it shows |
| --- | --- |
| `m0/05-install-your-agent-app/` | Annotated real macOS first-session controls for Claude Code, Codex in ChatGPT desktop, and OpenCode; OpenCode's free-model picker. Captured 2026-09-08. Project names blurred, unrelated history/account information cropped out. |
| `m0/06-build-your-first-thing/` | A fictional checklist example. Learners may build something different. |
| `m3/04-steering-and-recovery/` | A fictional practice page after restoration. |
| `m4/02-sign-in/` | Supabase Authentication controls. |
| `m4/03-profile/`, `m4/04-posts/`, `m4/05-follow/`, `m4/07-comments/` | Previously captured Supabase controls; private details blurred. |

Fictional example pages illustrate a possible result; they are not evidence of an agent session. Real onboarding captures document the visible controls on the capture date; labels and available models can change. File hashes and provenance for the new onboarding captures are in `m0/05-install-your-agent-app/provenance.json`.
