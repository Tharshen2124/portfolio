---
title: Building the Hackerspace Ecosystem
role: Lead Developer
organization: Hackerspace MMU
category: university
startDate: 2023-11-01
summary: Rebuilt Hackerspace MMU's 15-year-old member system into one ecosystem, with an API layer, a Next.js committee dashboard, an automated registration pipeline and a Discord bot, all running at zero cost.
skills: [Next.js, TypeScript, Ruby on Rails, Google Apps Script, Discord Bots]
links:
  - label: Hackerspace MMU
    url: https://hackerspacemmu.rocks/
  - label: Launch post on LinkedIn
    url: https://www.linkedin.com/feed/update/urn:li:activity:7467619355485319170/
---

For 15 years, Hackerspace MMU has used **Hacktrack** to track members, their project progress, meetups and hackathons. It started as a Ruby on Rails tutorial project from our lecturer, Willie Poh. The system worked, but member data lived in two places: the Hacktrack database and a Google Sheet. Syncing them was 100% manual, so every new member meant duplicated work and plenty of room for mistakes.

The Hackerspace Ecosystem is what Hacktrack grew into once we fixed that.

## How it started

I started the rebuild in November 2023, while I was [President](/experience/hackerspace-mmu-president). The first attempt was a Svelte frontend sitting on top of the existing Rails app. It never got past that stage. It was only a new frontend, and the data problem underneath it was still there.

In 2025 I picked it back up with other members and took a wider view. Instead of just replacing the frontend, we built the pieces around the old system so the committee could stop working in two places.

## The architecture now

The original Rails app still runs underneath with all 15 years of data. Around it:

- **An API layer** on top of the Rails app, so everything else talks to one source of truth
- **A Next.js frontend** for the committee to manage members and meetups
- **A Google Apps Script pipeline** that syncs new registrations into both the database and the spreadsheet automatically
- **A Discord bot** that onboards new members to the server and lets them check their own stats and history

The spreadsheet is still around, but it's basically read-only now. New members get processed automatically and the bot handles Discord onboarding. Less manual work, fewer mistakes.

## Running it for free

The whole thing runs without paying a single cent:

- **Vercel** for the frontend
- **Heroku** for the backend
- **Koyeb** for the Discord bot, with a cron job to keep it awake
- **GitHub Pages** for the public site

## Why it matters to me

It's the first thing I've deployed that real users actually rely on. Big thanks to everyone who built and maintained Hacktrack over the years, and especially to Willie Poh, who pushed me, gave me direction when I needed it, and helped me get this across the line.

We'll keep upgrading and maintaining it for years to come. The dashboard and the legacy Hacktrack are for Hackerspace members only, so I can't link them here, but the [Hackerspace website](https://hackerspacemmu.rocks/) is public.
