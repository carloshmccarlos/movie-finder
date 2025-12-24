# Tech Stack – AI Movie Search (TanStack Start)

This document describes the recommended technology stack for the AI-powered movie search website built with **TanStack Start**.

## 1. Frontend

- **Framework**: TanStack Start (React + TypeScript)
  - File-based routing, data loading, and streaming-ready UI.
  - Good DX for building SPA/SPA+SSR apps.

- **Language**: TypeScript
  - Safer code and better tooling/auto-complete.

- **UI & Styling**
  - **Tailwind CSS**
    - Utility-first, fast to iterate on responsive layouts.
    - Works well with React component patterns.
  - (Optional) **shadcn/ui** or similar headless component library
    - For ready-made accessible components (buttons, inputs, dialogs, etc.).

- **State & Data Fetching**
  - **TanStack Query** (built into TanStack Start)
    - Data fetching, caching, background refreshing for search results and metadata (movies, platforms).
  - **TanStack Router** (via TanStack Start)
    - Routing between main search page, movie detail pages, and any future sections.

- **Icons & Visuals**
  - **Lucide** or **Heroicons** for simple, modern icons.
  - Movie posters and artwork sourced from the chosen movie API (e.g. TMDB images).

## 2. Backend / API Layer

TanStack Start can be used with server-side routes or a separate backend; choose based on complexity.

### Option A: API Routes within TanStack Start

- Use **server-side route handlers** (or server actions) in the TanStack Start project to:
  - Accept search input + filters (类型、地区、年代、情绪、题材、平台、热度).
  - Call the LLM / embedding search service.
  - Call movie metadata and where-to-watch APIs.
  - Merge and return ranked results to the client.

### Option B: Separate Backend Service

- **Runtime**: Node.js (LTS)
- **Framework**: Fastify / Express / Hono
  - Simple JSON APIs for `POST /search`, `GET /movie/:id`, etc.

In both cases, the API should:

- Expose a **/search** endpoint with:
  - `query`: free-text description.
  - `filters`: structured (类型、地区、年代、平台) and soft (情绪、题材、热度).
- Handle merging AI ranking results with structured filter constraints.

## 3. AI & Search

- **LLM / Embedding Provider**
  - **Primary**: SiliconFlow (siliconflow.cn) for LLM and/or embeddings via HTTP APIs.
  - **Alternatives / Fallbacks** (optional):
    - OpenAI / Azure OpenAI
    - Anthropic
    - Local / self-hosted embeddings service (e.g. using sentence-transformers)

- **Vector Search / Semantic Layer**
  - Use a vector database or search service to store movie embeddings:
    - Supabase Vector, Pinecone, Weaviate, or PostgreSQL with pgvector.
  - Workflow:
    1. Precompute embeddings for movie plots, tags, moods, and metadata.
    2. At query time, embed the user description + soft filters (情绪、题材、热度) into a combined embedding.
    3. Run a similarity search, then apply hard filters (类型、地区、年代、平台) before final ranking.

- **Model Orchestration**
  - A thin service layer that:
    - Transforms user query + filters into an embedding-friendly representation.
    - Applies business rules for hard vs soft filters.

## 4. Movie & Platform Data

- **Movie Metadata API**
  - **TMDB** (The Movie Database) or a similar service.
  - Used for:
    - Titles, years, plots, genres, posters, ratings.

- **Where-to-Watch / Platform Availability**
  - **JustWatch API** or regional equivalents (if accessible).
  - Alternatively, a custom curated mapping for a smaller catalog at MVP stage.

- **Caching Layer**
  - Use TanStack Query caching on the frontend.
  - Backend: in-memory cache (e.g. Node LRU) or Redis if scale increases.

## 5. Infrastructure & DevOps

- **Deployment (Frontend + TanStack Start)**
  - Vercel / Netlify / Cloudflare Pages for static + serverless functions.

- **Backend / API (if separate)**
  - Node.js service on:
    - Fly.io, Render, Railway, or a cloud provider (AWS, GCP, Azure).

- **Database / Vector Store**
  - Managed Postgres with pgvector (e.g. Supabase, Neon) **or**
  - Dedicated vector DB (Pinecone, Weaviate, Qdrant Cloud).

- **Environment & Secrets**
  - Use `.env` files locally and platform-specific secret managers in production
    (Vercel/Netlify environment variables, cloud key vaults, etc.).

## 6. Observability & Quality

- **Logging & Monitoring**
  - Application logs via hosting provider or tools like Logtail / Datadog (optional).
  - Frontend error tracking with Sentry or similar.

- **Testing**
  - **Unit & Integration**: Vitest / Jest for core logic.
  - **E2E**: Playwright / Cypress for main flows (search → results → detail).

## 7. Summary

- **Core Frontend**: TanStack Start (React + TypeScript) + Tailwind CSS.
- **Core Backend**: Node-based API (inside TanStack Start or separate) calling LLM + movie APIs.
- **Search Intelligence**: Embedding-based semantic search + hard/soft filters modeled after Tencent Video-style browsing.
- **Data**: TMDB (or similar) for metadata, JustWatch-style data for platforms, Postgres/pgvector or vector DB for embeddings.

This stack balances modern AI discovery, familiar Chinese-style filters, and a pragmatic deployment path using TanStack Start as the main framework.
