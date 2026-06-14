# 🌐 Global Translator

An enterprise-grade AI translation web app with **5-provider automatic fallback** — it always finds a working translation engine, even when one is down.

---

## ✨ Features

| Category | Features |
|---|---|
| **Translation** | 5 providers with auto fallback, retry + exponential backoff, 1h cache |
| **Languages** | 40+ languages, auto-detect source, searchable selector with flags |
| **Voice** | Voice input (STT), text-to-speech playback |
| **UX** | Auto-translate while typing, dark/light mode, keyboard shortcuts |
| **History** | Last 50 translations stored locally |
| **Favorites** | Star and save translations |
| **Export** | Copy, download TXT, native share |
| **Monitoring** | Live provider health, active provider badge |

---

## 🏗 Architecture

```
global-translator/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Header, Footer
│   │   │   ├── translator/    # Hero, LanguageBar, InputPanel, OutputPanel,
│   │   │   │                  # ActionBar, HistoryDrawer, FavoritesDrawer
│   │   │   └── ui/            # Toasts, Spinner, LangModal
│   │   ├── hooks/             # useTranslator, useTheme, useToast, useSpeech
│   │   ├── store/             # localStorage (history + favorites)
│   │   └── utils/             # api.js, languages.js
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                    # Node.js + Express backend
│   ├── src/
│   │   ├── services/
│   │   │   ├── providers.js          # 5 translation providers
│   │   │   ├── provider-manager.js   # Health tracking, auto-disable/recover
│   │   │   ├── translation.service.js # Orchestrates fallback chain
│   │   │   ├── cache.service.js      # 1-hour in-memory cache
│   │   │   └── languages.data.js     # Fallback language list
│   │   ├── routes/            # translate.js, languages.js, system.js
│   │   ├── middleware/        # errorHandler.js, validate.js
│   │   └── utils/logger.js
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 🔄 Provider Fallback Chain

| Priority | Provider | Notes |
|---|---|---|
| 1 | **LibreTranslate** | Self-hostable, primary |
| 2 | **LibreTranslate Mirrors** | argosopentech, fortytwo-it, vern.cc |
| 3 | **MyMemory** | Free, 5k chars/day without key |
| 4 | **Lingva** | Google-compatible, no key needed |
| 5 | **Google Translate v2** | Requires API key, optional |

If a provider fails 3 times, it's temporarily disabled and auto-recovers after a cooldown period.

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+

### Backend
```bash
cd server
cp .env.example .env     # Optional: add API keys for more providers
npm install
npm run dev              # → http://localhost:3001
```

Verify: `curl http://localhost:3001/api/health`

### Frontend
```bash
cd client
cp .env.example .env     # VITE_API_URL=http://localhost:3001
npm install
npm run dev              # → http://localhost:5173
```

---

## ☁️ Deployment

### Backend → Render (free)

1. Push `server/` directory to GitHub (or mono-repo root)
2. New Web Service on [render.com](https://render.com)
3. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Runtime:** Node 20
4. Environment variables:

| Key | Value |
|---|---|
| `PORT` | `3001` |
| `NODE_ENV` | `production` |
| `LIBRE_TRANSLATE_URL` | `https://libretranslate.com` |
| `LIBRE_TRANSLATE_API_KEY` | *(optional)* |
| `GOOGLE_API_KEY` | *(optional — unlocks Google provider)* |
| `MYMEMORY_EMAIL` | *(optional — increases MyMemory quota)* |
| `ALLOWED_ORIGINS` | `https://YOUR_USERNAME.github.io` |

5. Deploy → note your URL: `https://global-translator-xyz.onrender.com`
6. Verify: `curl https://your-url.onrender.com/api/health`

---

### Frontend → GitHub Pages

1. Edit `client/vite.config.js`:
   ```js
   base: "/YOUR_REPO_NAME/",
   ```

2. Edit `client/package.json`:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
   ```

3. Create `client/.env.production`:
   ```
   VITE_API_URL=https://your-render-url.onrender.com
   ```

4. Deploy:
   ```bash
   cd client
   npm install
   npm run deploy
   ```

5. GitHub repo → Settings → Pages → Branch: `gh-pages` → Save

6. Visit: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

---

### Alternative: Vercel (frontend)

```bash
cd client
npm run build
# Push to GitHub, then import on vercel.com
# Add env var: VITE_API_URL=https://your-render-url.onrender.com
```

### Alternative: Docker

```bash
# Build client first
cd client && npm install && npm run build && cd ..

# Start full stack
docker-compose up --build
```

---

## 🔌 API Reference

### `POST /api/translate`

**Request:**
```json
{ "text": "Hello world", "source": "en", "target": "es" }
```

**Success response:**
```json
{
  "translatedText": "Hola mundo",
  "provider": "MyMemory",
  "cached": false
}
```

### `GET /api/languages`
Returns `[{ "code": "en", "name": "English" }, …]`

### `GET /api/health`
```json
{
  "status": "healthy",
  "translation": "working",
  "activeProvider": "MyMemory",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### `GET /api/providers`
Returns full provider health + cache stats.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Cmd/Ctrl + Enter` | Translate |
| `Escape` | Close drawers/modals |

---

## 🔑 Environment Variables

### Server
| Variable | Required | Description |
|---|---|---|
| `PORT` | No (3001) | Server port |
| `LIBRE_TRANSLATE_URL` | No | LibreTranslate URL |
| `LIBRETRANSLATE_URL` | No | Alias for above |
| `LIBRE_TRANSLATE_API_KEY` | No | LibreTranslate key |
| `GOOGLE_API_KEY` | No | Unlocks Google provider |
| `MYMEMORY_EMAIL` | No | Increases MyMemory quota |
| `ALLOWED_ORIGINS` | No | CORS whitelist (comma-separated) |
| `LOG_LEVEL` | No (info) | error/warn/info/debug |

### Client
| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3001` | Backend URL |
