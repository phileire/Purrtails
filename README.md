# Purrtrail

A responsive cat journal built with React, Vinext and Cloudflare Workers.

## Features
- ChatGPT sign-in through Sites
- Camera capture and up to six photos per cat
- Multiple names, location capture or manual place entry, and notes
- Account-owned journals with public profile links
- Native phone sharing, WhatsApp, email and copy link
- D1 records and R2 photo storage

The hosted version uses Sites authentication and storage. Moving to another host requires replacing those integrations; the source does not contain a standalone email/password service.

## Development
Use Node 22.13 or later and npm. Run `npm run install:ci`, `npm run db:generate`, and `npm run build`. Apply generated migrations to local D1 as described in the starter documentation, then run `npm run dev`.

The local development server simulates ChatGPT sign-in. Production identity is supplied by the Sites platform. Never trust user-supplied identity headers on an unprotected alternate host.

## Photo credit
Garden cat photograph by Bailey Burton on Unsplash, https://unsplash.com/photos/d9ZwnNLvjuo (Unsplash License).
