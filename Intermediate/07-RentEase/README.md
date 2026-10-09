# RentEase

> **Peer-to-peer equipment rental platform.**
> Someone owns what you need — rent it only for the time you need it.

RentEase connects people who own equipment with people who need it. List your gear,
browse the live inventory, pick a rental window, and reserve — the equipment moves
through time between owners and renters instead of sitting unused.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Booking State Machine](#booking-state-machine)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Roadmap](#roadmap)
- [Author](#author)

---

## Overview

RentEase is a full-stack web application built around three ideas:

1. **Equipment is a physical asset** — every item gets an ID, a status, an owner, and a documented condition.
2. **Time is the core unit** — a rental is defined by a start date, an end date, and a rate per day.
3. **Exchange is between people** — the platform is a marketplace, not a store. Owners list, renters reserve, both sides manage their activity.

The application covers the entire rental lifecycle: authentication, inventory
management, discovery with filters, detail pages, time-based booking with overlap
detection, booking approval workflow, and profile management.

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Framework | ASP.NET Core Web API |
| Language | C# |
| ORM | Entity Framework Core |
| Database | SQL Server |
| Auth | ASP.NET Identity + JWT (HttpOnly cookies) |
| Image Storage | Local file system (`wwwroot/uploads`) |
| Patterns | Repository, Specification, Service Layer |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Angular 22 |
| State | Angular Signals |
| Forms | Signal Forms (`@angular/forms/signals`) |
| Styling | Tailwind CSS v4 |
| HTTP | HttpClient + functional interceptors |
| Routing | Standalone components + lazy loading |
| Testing | Vitest + jsdom |

---

## Features

### 🔐 Authentication
- Register, login, logout
- JWT stored in HttpOnly cookie
- Auto-attached to every request via interceptor
- Auto-redirect to `/login` on `401`
- Route guard protecting authenticated pages

### 🏠 Landing page
- Editorial hero with live asset record
- Exchange diagram (Owner → Equipment → Renter)
- Category index with 8 illustrated categories
- Timeline section explaining equipment availability over time
- Owner-focused section ("your equipment doesn't have to sit still")
- Live inventory preview
- Dual CTA (find equipment / list equipment)

### 📦 Equipment
- **Browse** — full inventory with category and max-price filters
- **Details** — editorial layout with metadata grid and booking panel
- **Create** — 4-step asset registration (identity → rate → documentation → publish)
- **Update** — edit name, category, and daily rate
- **Availability toggle** — enable / disable listing (blocked if active bookings exist)
- **Delete** — owner-only removal
- **My Equipment** — personal inventory view
- **Image upload** — JPG / PNG, up to 200 MB, with fallback illustrations

### 📅 Bookings
- **Create** — select a rental window with live duration + price calculation
- **Validation** — no past dates, start before end, no self-booking, no overlapping bookings
- **My Rentals** — renter's booking history with status filters
- **Requests** — owner's incoming bookings with confirm / reject actions
- **State transitions** — confirm, reject, cancel, complete
- **Delete** — allowed only for closed bookings (cancelled / rejected / completed)

### 👤 Profile
- Account statistics (assets, active rentals, completed rentals)
- Update full name and phone number
- Change password
- Sign out

### 🎨 UI / UX
- Full dark mode (designed, not inverted)
- 13 hand-drawn SVG equipment illustrations
- Toast notifications styled as system status messages
- Terminal-style confirmation popups
- Fully responsive (mobile → desktop)
- Accessible (semantic HTML, keyboard navigation, focus states, reduced motion)

---

## Architecture
