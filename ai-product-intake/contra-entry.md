# AI-Assisted Product Intake Workflow

- **Project type:** Personal Project / Demo
- **Role:** Product UX, workflow design, full-stack implementation
- **Skills:** AI workflows, structured output, JavaScript, Node.js, product design, API integration
**Project link:** https://github.com/Rxwkovo/product-engineer-portfolio/tree/main/ai-product-intake

## Description (140 words)

Forma is a personal demo for turning a rough product or event request into a brief that a team can actually review. A user describes an idea in natural language; the workflow proposes a structured title, goal, audience, date, location, format, deliverables, tone, and open questions. Every field stays editable, and the brief is only finalized after a human confirms it. The confirmed result can be exported as JSON for the next step in a product workflow. I built the interface, review states, and server endpoint around a clear separation between model output and human decisions. When a model key is configured, the server requests schema-constrained output through the OpenAI Responses API. Without a key, the app labels its local rule-based parser as a demo. It is a generic portfolio concept, with no client-specific logic or claims of production use.

## Cover text

From a rough idea to a reviewed, structured brief.

## Image order

1. `cover.png` — Interface overview.
2. `01-describe.png` — Natural language input.
3. `02-structured-draft.png` — Generated draft in explicitly labelled local demo mode.
4. `03-review-edit.png` — Human editing fields before confirmation.
5. `04-confirmed.png` — Confirmed brief and JSON export.

## Disclosure

The screenshots show the local parser mode. The OpenAI API integration is implemented, but a live model call has not been verified without an API key. No customer data or outcomes are represented.
