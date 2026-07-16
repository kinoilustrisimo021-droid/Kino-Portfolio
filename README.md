# Kino Ilustrisimo Automation, Data, and Business Support Portfolio

This repository contains a static, GitHub Pages-ready professional portfolio for Kino Ilustrisimo. It presents two complementary capability tracks: Python automation, data reporting, dashboards, and workflow improvement; plus customer and CRM support, spreadsheet work, and administrative operations for future job or client opportunities.

## Files

- `index.html` - Portfolio content and page structure
- `styles.css` - Premium dark visual system, responsive Hire Me conversion section, mobile-first layouts, interaction states, and print/PDF styling
- `script.js` - Mobile navigation, scroll reveals, page progress, active navigation, accessible project previews, and portfolio chatbot logic
- `api/portfolio-chat.js` - Secure serverless AI endpoint with bounded conversation history, portfolio grounding, privacy rules, and rate limiting
- `api/portfolio-assistant-prompt.js` - Versioned AI behavior instructions for conversational tone, portfolio grounding, general guidance, context, and privacy
- `tests/portfolio-assistant-prompt.test.js` - Prompt contract and secure request-shape regression tests
- `.env.example` - Server-side OpenAI environment variable template; never place a real key in frontend code
- `portfolio-profile.json` - Main structured chatbot knowledge source for About, Skills, Services, Projects, Tools, Experience, Contact, and Privacy
- `portfolio.txt` - Plain-text editable portfolio profile summary
- `skills.json` - Editable skills and tools catalog
- `projects.json` - Editable project portfolio with problem solved, tools used, features, business impact, and screenshots
- `services.json` - Editable service catalog for dashboard, automation, reporting, chatbot, and data validation support
- `contact.json` - Editable contact, availability, project request, and email provider configuration
- `faq.txt` - Short editable FAQ support file
- `questionnaire.txt` - Extended FAQ support knowledge base for the browser-local assistant (kept out of the live AI prompt to reduce latency and input cost)
- `assets/kino-ilustrisimo.jpg` - Professional portrait used in the hero section, if provided
- `assets/kino-logo.png` - Official black, gold, and silver KI crown logo used for the site identity, favicon, portrait fallback, and AI assistant
- `assets/projects/` - Actual project screenshots used by the project portfolio cards, with SVG fallbacks

## Portfolio Chatbot

The website includes a floating portfolio assistant at the bottom-right of the page. It opens into a professional chat window, shows suggested questions and quick action buttons, and answers using structured portfolio files first, with FAQ files as support.

The assistant now uses a hybrid setup. On a serverless host with `OPENAI_API_KEY` configured, it uses a real multi-turn AI endpoint grounded in the verified portfolio data. If the endpoint is unavailable—or when the site is hosted only on GitHub Pages—it automatically falls back to the local privacy-safe portfolio answer engine. Visitors can type naturally and receive answers without completing a questionnaire.

### Chatbot Features

- Suggested questions shown when the chat opens
- Direct free-text chat with no required questionnaire
- Natural greetings, thanks, clarification, follow-up context, and clearly identified AI behavior
- Portfolio-first answers plus clearly separated general guidance when live AI is connected
- Bounded multi-turn conversation history when the secure AI endpoint is connected
- Automatic local fallback when the AI endpoint is unavailable
- Quick actions for viewing projects, exporting PDF, and submitting a project request
- English, Filipino, Taglish, short-question, and incorrect-grammar intent handling
- Service recommendation for dashboard, automation, reporting, data validation, and chatbot requests
- Project explanation mode with problem solved, tools used, features, business impact, and screenshot path
- Optional project brief flow; only name, email, and a short message are required
- Request review screen before final submission
- Failed or unfinished project request deliveries keep up to five local browser copies for 30 days and can be downloaded as JSON; successfully delivered requests are not retained locally
- Optional automatic email sending through Formspree or EmailJS using `contact.json`
- Privacy rules for confidential, private, salary, credential, debtor, account-level, and client data

### Edit the Chatbot Knowledge Base

Update these files when changing chatbot content:

- `api/portfolio-assistant-prompt.js` for live AI behavior, tone, source boundaries, and response examples
- `portfolio-profile.json` for main profile sections and bot intent categories
- `portfolio.txt` for a plain-text business profile
- `skills.json` for skills, tools, and capabilities
- `projects.json` for project explanation mode
- `services.json` for service recommendations
- `contact.json` for email, GitHub, LinkedIn, portfolio URL, availability, project request settings, and email provider setup
- `faq.txt` for short common questions
- `questionnaire.txt` for extended FAQ coverage

Use `faq.txt` or `questionnaire.txt` for extra FAQ support. Add or update entries using this format:

```text
# Category Name
Q: What question should the chatbot answer?
A: The professional answer the chatbot should provide.
```

Keep answers portfolio-safe. Do not add confidential client data, debtor information, account-level details, credentials, internal URLs, or private company information.

### Secure AI Setup

The browser calls `/api/portfolio-chat`; the serverless function then calls the OpenAI Responses API. The API key stays in the hosting provider's server-side environment and is never sent to the visitor's browser.

1. Deploy the repository to a host that supports Node serverless functions, such as Vercel.
2. Add `OPENAI_API_KEY` in the project's environment settings.
3. Optionally add `OPENAI_MODEL`; the included endpoint defaults to `gpt-5.4-mini`.
4. Redeploy, then ask a question in the sidebar. The status changes to `AI connected` after a successful model response.

```text
OPENAI_API_KEY=your_server_side_key
OPENAI_MODEL=gpt-5.4-mini
```

Never paste the key into `script.js`, `index.html`, a public repository, or any other browser-delivered file. The endpoint validates request size and input length, limits retained history, sends `store: false`, grounds portfolio claims in the public JSON/text knowledge files, and falls back locally when unavailable.

Run the prompt and request-shape regression checks with:

```powershell
node --test tests\portfolio-assistant-prompt.test.js
```

The included in-memory request limit is a best-effort development safeguard. Because serverless instances do not share memory, protect a public production deployment with a platform-level firewall/rate limit or a shared store such as Redis. The chat UI also reminds visitors that live messages are processed by OpenAI and should not contain confidential or sensitive information.

### Static and Local Fallback

GitHub Pages cannot run the serverless AI endpoint, but the same UI continues to answer through the built-in retrieval fallback. The chatbot also loads JSON and text files with browser `fetch`, so the full local knowledge base works best through GitHub Pages or a local web server instead of opening the HTML as `file://`.

### Project Request Email Setup

The project request form is configured to send to `kinoilustrisimo.021@gmail.com` through FormSubmit. A capped 30-day local browser copy is created only when delivery fails or the visitor still needs to complete a prepared email.

FormSubmit may send an activation email on the first live submission. Open that email and confirm the address so future project requests can go directly to the inbox.

Current setup in `contact.json`:

```json
"projectRequest": {
  "enabled": true,
  "provider": "formsubmit",
  "recipientEmail": "kinoilustrisimo.021@gmail.com",
  "formsubmitEndpoint": "https://formsubmit.co/ajax/kinoilustrisimo.021@gmail.com"
}
```

Alternative setup options are still supported.

For Formspree:

1. Create a Formspree form and verify your email.
2. Copy the endpoint URL.
3. Update `contact.json`:

```json
"projectRequest": {
  "enabled": true,
  "provider": "formspree",
  "recipientEmail": "your-email@example.com",
  "formspreeEndpoint": "https://formspree.io/f/your-form-id"
}
```

For EmailJS:

1. Create an EmailJS service and template.
2. Add template variables such as `from_name`, `reply_to`, `project_type`, `project_description`, `estimated_budget`, and `message`.
3. Update `contact.json` with your public key, service ID, and template ID.

If no provider is configured, the assistant saves requests locally and offers a JSON download. If only `recipientEmail` is configured, the assistant can prepare a `mailto:` email, but the visitor still needs to press send in their email app.

## Privacy Note

This public version intentionally excludes the exact residential address, credentials, and raw client production data. The project screenshots provided for portfolio presentation are included in `assets/projects/`.

The assistant is connected only to the public portfolio files in this repository. It does not have access to private databases, account records, live dashboards, internal systems, or visitor-uploaded documents.

## Project Screenshot Filenames

The portfolio includes actual JPG project screenshots in `assets/projects/`. SVG versions remain as fallback visuals only.

- `mc6-collection-pipeline.svg`
- `mc6-collection-pipeline.jpg`
- `digital-omnichannel-dashboard.svg`
- `digital-omnichannel-dashboard.jpg`
- `digital-reporting-app.svg`
- `digital-reporting-app.jpg`
- `excel-reporting-result.svg`
- `excel-reporting-result.jpg`
- `predictive-summary-extractor.svg`
- `predictive-summary-extractor.jpg`
- `alloc-review-builder.svg`
- `alloc-review-builder.jpg`
- `auto-redial.svg`
- `auto-redial.jpg`
- `mc6-analytics-hub.svg`
- `mc6-analytics-hub.jpg`
- `report-auto-extractor.svg`
- `report-auto-extractor.jpg`

The page also accepts `.png` and `.webp` versions with the same base names.

## Publish on GitHub Pages

Use this route for the free static portfolio and local assistant fallback. Use a serverless host for the real AI connection.

1. Create a new GitHub repository.
2. Upload `index.html`, `styles.css`, `script.js`, `portfolio-profile.json`, `portfolio.txt`, `skills.json`, `projects.json`, `services.json`, `contact.json`, `faq.txt`, `questionnaire.txt`, `README.md`, and the `assets/` folder to the repository root.
3. Go to `Settings` > `Pages`.
4. Under `Build and deployment`, select `Deploy from a branch`.
5. Select the `main` branch and `/root`, then save.
6. Open the GitHub Pages URL after deployment finishes.

## Local Preview

Open `index.html` directly in a browser for a basic visual preview. For the chatbot to load the full structured profile, project, service, contact, and FAQ knowledge base, use GitHub Pages, VS Code Live Server, or any local web server.

If Python is installed, run:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

If Python is not installed, publish to GitHub Pages or use a local server extension in VS Code.
