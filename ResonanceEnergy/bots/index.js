// ═══════════════════════════════════════════════════════════════
// Arctic Electric — Bot Launcher
// ═══════════════════════════════════════════════════════════════
//
//  Usage:
//    node index.js              # Start BOTH bots
//    node index.js --telegram   # Start Telegram only
//    node index.js --discord    # Start Discord only
//    npm start                  # Start BOTH bots
//    npm run telegram           # Telegram only
//    npm run discord            # Discord only
//
// ═══════════════════════════════════════════════════════════════

require('dotenv').config();

const { createLogger } = require('./shared/logger');
const { SHORT_NAME, VERSION, TAGLINE } = require('./shared/branding');

const log = createLogger('Main');

// ────────────────────── Banner ──────────────────────

function printBanner() {
  console.log('');
  console.log('  ╔══════════════════════════════════════════════╗');
  console.log('  ║  ❄️⚡  ARCTIC ELECTRIC — Bot System  ⚡❄️     ║');
  console.log('  ║                                              ║');
  console.log('  ║  "The cold is the fuel.                      ║');
  console.log('  ║   The cold never runs out."                  ║');
  console.log('  ║                                              ║');
  console.log(`  ║  Version: ${VERSION.padEnd(35)}║`);
  console.log('  ╚══════════════════════════════════════════════╝');
  console.log('');
}

// ────────────────────── Validation ──────────────────────

function validateEnv(mode) {
  const errors = [];

  if (mode !== 'discord' && !process.env.TELEGRAM_BOT_TOKEN) {
    errors.push('TELEGRAM_BOT_TOKEN is missing');
  }
  if (mode !== 'telegram' && !process.env.DISCORD_BOT_TOKEN) {
    errors.push('DISCORD_BOT_TOKEN is missing');
  }
  if (mode !== 'telegram' && !process.env.DISCORD_CLIENT_ID) {
    errors.push('DISCORD_CLIENT_ID is missing');
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    errors.push('ANTHROPIC_API_KEY is missing (AI responses will fail)');
  }

  if (errors.length > 0) {
    console.error('');
    console.error('  ⚠️  Environment Configuration Errors:');
    errors.forEach(e => console.error(`     • ${e}`));
    console.error('');
    console.error('  Copy .env.example to .env and fill in your tokens.');
    console.error('');
    process.exit(1);
  }
}

// ────────────────────── Main ──────────────────────

async function main() {
  printBanner();

  // Parse args
  const args = process.argv.slice(2);
  const telegramOnly = args.includes('--telegram');
  const discordOnly = args.includes('--discord');
  const mode = telegramOnly ? 'telegram' : (discordOnly ? 'discord' : 'both');

  log.info(`Starting in ${mode.toUpperCase()} mode`);

  // Validate
  validateEnv(mode);

  const startups = [];

  // Start Telegram
  if (mode === 'both' || mode === 'telegram') {
    const { startTelegramBot } = require('./telegram/bot');
    startups.push(
      startTelegramBot()
        .then(() => log.info('✅ Telegram bot is LIVE'))
        .catch((err) => {
          log.error('❌ Telegram bot failed to start:', err.message);
          if (mode === 'telegram') process.exit(1);
        })
    );
  }

  // Start Discord
  if (mode === 'both' || mode === 'discord') {
    const { startDiscordBot } = require('./discord/bot');
    startups.push(
      startDiscordBot()
        .then(() => log.info('✅ Discord bot is LIVE'))
        .catch((err) => {
          log.error('❌ Discord bot failed to start:', err.message);
          if (mode === 'discord') process.exit(1);
        })
    );
  }

  await Promise.all(startups);

  console.log('');
  log.info('═══════════════════════════════════════════');
  log.info(`  ${SHORT_NAME} bots are running!`);
  log.info('  Press Ctrl+C to stop.');
  log.info('═══════════════════════════════════════════');
  console.log('');
}

// ────────────────────── Error Handlers ──────────────────────

process.on('unhandledRejection', (err) => {
  log.error('Unhandled rejection:', err);
});

process.on('uncaughtException', (err) => {
  log.error('Uncaught exception:', err);
  process.exit(1);
});

// ────────────────────── Run ──────────────────────

main().catch((err) => {
  log.error('Fatal error:', err);
  process.exit(1);
});
