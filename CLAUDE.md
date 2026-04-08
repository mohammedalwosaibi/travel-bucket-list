# Project: Travel Bucket List
**Goal:** A full-stack Next.js web app where users can search for countries and save them to a personal bucket list.

## Tech Stack
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **Authentication:** Clerk
* **Database:** Supabase
* **External API:** REST Countries API (`https://restcountries.com/v3.1/name/{name}`)

## Core Requirements
1.  **Public API Search:** Users can search for countries without logging in. Display the country name, flag (`flags.svg`), and capital.
2.  **Authentication:** Users must log in via Clerk to save a country.
3.  **Database:** Saved countries are stored in Supabase. The table MUST include a `user_id` string matching the Clerk user ID to scope data. Include a field for user `notes`.
4.  **Dashboard:** Authenticated users have a view to see their saved countries and notes.

## Workflow Rules
* Commit frequently after every successful phase.
* Prioritize clean, modern UI with Tailwind.
* Never hardcode API keys; always assume they are in `.env.local`.