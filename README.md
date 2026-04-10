# Clabstream AI Studio

Internal Clabstream tool for the team to review and operate the studio UI locally.

## Current status

- Image generation is currently paused until provider credits are added.
- The UI is still available for internal review and safe testing.

## Local use

1. Install dependencies with `npm install`
2. Start the app with `npm run dev`
3. Open `http://localhost:3000`

## Safety notes

- Do not commit `.env.local`
- Do not paste secrets into prompts
- Do not paste secrets into source code
- Keep provider credentials server-side only
