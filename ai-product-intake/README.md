# Forma — AI-Assisted Product Intake Workflow

**Personal Project / Demo.** A small, generic workflow for turning a natural language product or event request into a structured brief, then reviewing, editing, confirming, and exporting it. It is not a reproduction of a client's private product.

## Run

Requires Node.js 20 or newer. No package installation is needed.

```bash
node server.js
```

Open `http://127.0.0.1:8788`.

Without `OPENAI_API_KEY`, the app runs a clearly labelled **local demo parser**. It exercises the full review flow but is not AI output. To use a real model, set `OPENAI_API_KEY` on the server process. You can optionally set `OPENAI_MODEL`; the default is `gpt-4o-mini`. The key never goes to the browser. Requests use the OpenAI Responses API with JSON Schema structured output and `store: false`. An API error is surfaced to the user; it is not silently replaced with demo output.

Confirmed briefs download as JSON. No server side drafts or personal data are stored. The UI uses system fonts and CSS shapes; no third party visual assets are bundled.

## License

MIT. See `LICENSE`.
