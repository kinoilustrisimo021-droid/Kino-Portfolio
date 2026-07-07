# Kino Ilustrisimo Python Automation and Data Operations Portfolio

This repository contains a static, GitHub Pages-ready professional portfolio for Kino Ilustrisimo, focused on Python automation, data reporting, dashboard monitoring, operational workflow improvement, and project proof of work for future job or client opportunities.

## Files

- `index.html` - Portfolio content and page structure
- `styles.css` - Corporate layout, responsive design, and print/PDF styling
- `script.js` - Scroll reveal animation, page progress behavior, active navigation, project previews, and portfolio chatbot logic
- `portfolio-profile.json` - Main structured chatbot knowledge source for About, Skills, Services, Projects, Tools, Experience, Contact, and Privacy
- `portfolio.txt` - Plain-text editable portfolio profile summary
- `skills.json` - Editable skills and tools catalog
- `projects.json` - Editable project portfolio with problem solved, tools used, features, business impact, and screenshots
- `services.json` - Editable service catalog for dashboard, automation, reporting, chatbot, and data validation support
- `contact.json` - Editable contact, availability, project request, and email provider configuration
- `faq.txt` - Short editable FAQ support file
- `questionnaire.txt` - Extended FAQ support knowledge base with prepared questions and answers
- `assets/kino-ilustrisimo.jpg` - Professional portrait used in the hero section, if provided
- `assets/projects/` - Actual project screenshots used by the project portfolio cards, with SVG fallbacks

## Portfolio Chatbot

The website includes a floating portfolio assistant at the bottom-right of the page. It opens into a professional chat window, shows suggested questions and quick action buttons, and answers using structured portfolio files first, with FAQ files as support.

The current setup is retrieval-based, free, and safe for GitHub Pages. It acts as a portfolio assistant, service recommender, project explainer, and project request assistant. It uses intent mapping and semantic-style section matching for common English, Filipino, and Taglish portfolio questions. It does not invent information. If an exact answer is missing but a related portfolio section exists, it shares the related available information instead of immediately refusing.

### Chatbot Features

- Suggested questions shown when the chat opens
- Quick actions for viewing projects, exporting PDF, and submitting a project request
- English, Filipino, Taglish, short-question, and incorrect-grammar intent handling
- Service recommendation for dashboard, automation, reporting, data validation, and chatbot requests
- Project explanation mode with problem solved, tools used, features, business impact, and screenshot path
- Project Request Assistant flow with client name, email, company, project type, description, budget, timeline, preferred contact method, and notes
- Request review screen before final submission
- Project request entries are saved in the visitor's browser and can be downloaded as JSON
- Optional automatic email sending through Formspree or EmailJS using `contact.json`
- Privacy rules for confidential, private, salary, credential, debtor, account-level, and client data

### Edit the Chatbot Knowledge Base

Update these files when changing chatbot content:

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

### Replace or Modify the AI Model

The chatbot configuration is in `script.js` under `CHATBOT_CONFIG`.

Current provider:

```js
provider: "retrieval"
```

Future replacement options:

- Keep `retrieval` for a free static GitHub Pages setup.
- Replace with a local model endpoint, such as a local LLM server.
- Replace with a Hugging Face Inference endpoint through a backend.
- Replace with another API-based model through a backend.

Do not place private API keys directly in frontend JavaScript. For Hugging Face or API models, create a small backend proxy with Node.js, Flask, or FastAPI, then update `CHATBOT_CONFIG.futureModel.endpoint`.

### Local Chatbot Note

The chatbot loads the JSON and text knowledge files with browser `fetch`. This works on GitHub Pages or a local web server. If the site is opened directly as a `file://` page, some browsers block local file loading; the chatbot will still show a small fallback knowledge base, but the full assistant loads best through GitHub Pages or a local server.

### Project Request Email Setup

The project request form is configured to send to `kinoilustrisimo.021@gmail.com` through FormSubmit and also keeps a local browser backup.

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
