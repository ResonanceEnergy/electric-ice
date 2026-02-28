# ❄️⚡ Arctic Electric — Telegram & Discord Bots

> *"The cold is the fuel. The cold never runs out."*

AI-powered bots for **Resonance Energy Inc.** (Arctic Electric) — providing instant access to patent information, grant databases, project status, company details, and Claude-powered AI chat about Arctic energy harvesting technology.

---

## Architecture

```
bots/
├── index.js                  # Main launcher (runs both or one)
├── package.json              # Dependencies & scripts
├── .env                      # Your tokens (NEVER commit)
├── .env.example              # Template for .env
├── validate.js               # Config validation script
├── shared/
│   ├── ai.js                 # Anthropic Claude client + conversation memory
│   ├── branding.js           # Colors, emoji, company constants
│   ├── knowledge.js          # Patent, grants, project data + system prompt
│   └── logger.js             # Structured logging
├── telegram/
│   └── bot.js                # Telegraf-based Telegram bot
└── discord/
    └── bot.js                # Discord.js v14 bot with slash commands
```

---

## Quick Start

### 1. Install Dependencies

```bash
cd ResonanceEnergy/bots
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your tokens
```

Required variables:
| Variable | Description |
|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | From [@BotFather](https://t.me/BotFather) |
| `DISCORD_BOT_TOKEN` | From [Discord Developer Portal](https://discord.com/developers/applications) |
| `DISCORD_CLIENT_ID` | Your Discord application ID |
| `ANTHROPIC_API_KEY` | From [Anthropic Console](https://console.anthropic.com) |

### 3. Validate Configuration

```bash
node validate.js
```

### 4. Run

```bash
# Start BOTH bots
npm start

# Start only Telegram
npm run telegram

# Start only Discord
npm run discord
```

---

## Telegram Bot

### Commands
| Command | Description |
|---------|-------------|
| `/start` | Welcome message with keyboard menu |
| `/help` | Full command reference |
| `/ask [question]` | Ask the AI anything |
| `/patent` | Patent status, claims & innovations |
| `/grants` | All available grants & funding |
| `/grants_alaska` | Alaska & US Federal grants only |
| `/grants_alberta` | Alberta & Canada grants only |
| `/status` | Project status dashboard |
| `/company` | Company overview |
| `/clear` | Reset conversation memory |
| `/stats` | Bot statistics |

### Features
- **Custom keyboard** with quick-access buttons
- **AI chat** — send any message to get a Claude-powered response
- **Conversation memory** — remembers context within a session
- **Auto message splitting** — handles Telegram's 4096-char limit
- **Bot menu** — commands appear in Telegram's command list

### Setup via @BotFather
1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot`
3. Name: `Arctic Electric AI`
4. Username: `ArcticElectricBot` (or your choice)
5. Copy the token to `.env` → `TELEGRAM_BOT_TOKEN`

---

## Discord Bot

### Slash Commands
| Command | Description |
|---------|-------------|
| `/help` | List all commands |
| `/ask question:` | Ask the AI anything (with rich embed response) |
| `/patent` | Patent status & claims (embed) |
| `/grants [region:]` | Grants & funding (filterable by region) |
| `/status` | Project status dashboard (embed) |
| `/company` | Company overview (embed) |
| `/clear` | Reset your conversation memory |
| `/stats` | Bot statistics |

### Features
- **Slash commands** with auto-complete and options
- **Rich embeds** — color-coded cards (ice blue, patent purple, grants teal)
- **@mention chat** — mention the bot to start an AI conversation
- **DM support** — DM the bot for private AI chat
- **Conversation memory** — per-user context tracking
- **Auto-deploy** — slash commands registered on startup

### Setup via Discord Developer Portal
1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
2. Click **"New Application"** → Name: `Arctic Electric AI`
3. Go to **Bot** → Copy the token → `.env` → `DISCORD_BOT_TOKEN`
4. Copy the **Application ID** → `.env` → `DISCORD_CLIENT_ID`
5. Enable these **Privileged Gateway Intents**:
   - ✅ Message Content Intent
   - ✅ Server Members Intent (optional)
6. Go to **OAuth2 → URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions: `Send Messages`, `Read Message History`, `Embed Links`, `Use Slash Commands`, `Read Messages/View Channels`
7. Copy the generated URL and open it to invite the bot to your server

### Development Mode
For instant slash command updates during development, set `DISCORD_GUILD_ID` in `.env`:
```bash
DISCORD_GUILD_ID=your_server_id_here
```
Guild-specific commands update instantly. Global commands take ~1 hour.

---

## AI Integration

Both bots use **Anthropic Claude** (claude-sonnet-4-20250514) with:
- **System prompt** containing full Arctic Electric context (technology, patents, company, market data)
- **Per-user conversation memory** (last 20 messages, in-memory)
- **Error handling** with user-friendly fallback messages
- **Rate limit awareness** (429 handling)

### Knowledge Base
The AI has built-in knowledge of:
- 9 patent claims (3 independent, 6 dependent)
- 35+ grant programs (Alaska, Alberta, US Federal, Canada Federal)
- Project milestones (Q1 2026→Q2 2027)
- Company details, target markets, differentiation
- Technical specifications (TEG, piezo, magnetostrictive, materials)

---

## Running in Production

### Using PM2
```bash
npm install -g pm2

# Start both bots
pm2 start index.js --name "arctic-bots"

# Start individually
pm2 start index.js --name "arctic-telegram" -- --telegram
pm2 start index.js --name "arctic-discord" -- --discord

# Auto-restart on reboot
pm2 startup
pm2 save
```

### Using systemd (Linux)
```ini
[Unit]
Description=Arctic Electric Bots
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/path/to/bots
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10
EnvironmentFile=/path/to/bots/.env

[Install]
WantedBy=multi-user.target
```

### Using Docker
```dockerfile
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
CMD ["node", "index.js"]
```

---

## Security Notes

⚠️ **NEVER commit `.env` files** — they contain live API keys
- `.env` is already in `.gitignore`
- Rotate tokens regularly
- Use environment variables in production (not `.env` files)
- The bot tokens in OpenClaw config (`~/.openclaw/openclaw.json`) are separate — only one process per token

---

## Version

**v1.0.0** — February 2026

**Resonance Energy Inc.** | Arctic Electric
