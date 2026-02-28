// ═══════════════════════════════════════════════════════════════
// Arctic Electric — Telegram Bot
// ═══════════════════════════════════════════════════════════════
//
//  Commands:
//    /start    — Welcome message
//    /help     — List all commands
//    /ask      — Ask the AI anything about Arctic Electric
//    /patent   — Patent status & claims summary
//    /grants   — Available grants & funding programs
//    /status   — Project status dashboard
//    /company  — Company overview
//    /clear    — Clear conversation history
//
// ═══════════════════════════════════════════════════════════════

const { Telegraf, Markup } = require('telegraf');
const { createLogger } = require('../shared/logger');
const { EMOJI, TAGLINE, SHORT_NAME, VERSION } = require('../shared/branding');
const { getAIResponse, clearHistory, getStats } = require('../shared/ai');
const {
  formatPatentSummary,
  formatGrantsList,
  formatProjectStatus,
  formatCompanyOverview,
} = require('../shared/knowledge');

const log = createLogger('Telegram');

// ────────────────────── Initialize Bot ──────────────────────

function createTelegramBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    log.error('TELEGRAM_BOT_TOKEN is not set in environment');
    process.exit(1);
  }

  const bot = new Telegraf(token);

  // ────────────────── Error Handler ──────────────────

  bot.catch((err, ctx) => {
    log.error(`Error for ${ctx.updateType}:`, err.message);
    ctx.reply('⚠️ Something went wrong. Please try again.').catch(() => {});
  });

  // ────────────────── /start ──────────────────

  bot.start((ctx) => {
    log.info(`/start from ${ctx.from.username || ctx.from.id}`);

    const welcome = [
      `${EMOJI.snowflake}${EMOJI.bolt} **Welcome to ${SHORT_NAME}** ${EMOJI.bolt}${EMOJI.snowflake}`,
      '',
      `_"${TAGLINE}"_`,
      '',
      `I'm the Arctic Electric AI assistant. I can help you learn about:`,
      '',
      `${EMOJI.docs} Our patent & technology`,
      `${EMOJI.money} Available grants & funding`,
      `${EMOJI.chart} Project status & milestones`,
      `${EMOJI.brain} Anything about Arctic energy harvesting`,
      '',
      `**Quick Commands:**`,
      `/patent — Patent status & claims`,
      `/grants — Funding programs`,
      `/status — Project dashboard`,
      `/company — Company overview`,
      `/ask [question] — Ask me anything`,
      `/help — Full command list`,
      '',
      `Or just send me a message and I'll respond! ${EMOJI.rocket}`,
    ].join('\n');

    ctx.reply(welcome, {
      parse_mode: 'Markdown',
      ...Markup.keyboard([
        [`${EMOJI.docs} Patent`, `${EMOJI.money} Grants`],
        [`${EMOJI.chart} Status`, `${EMOJI.snowflake} Company`],
        [`${EMOJI.brain} Ask AI`],
      ]).resize(),
    });
  });

  // ────────────────── /help ──────────────────

  bot.help((ctx) => {
    const help = [
      `${EMOJI.snowflake} **Arctic Electric — Command Reference**`,
      '',
      `${EMOJI.rocket} **General:**`,
      `/start — Welcome & quick menu`,
      `/help — This help message`,
      `/clear — Reset conversation memory`,
      '',
      `${EMOJI.docs} **Patent & Technology:**`,
      `/patent — Patent status, claims & innovations`,
      `/ask [question] — Ask about our technology`,
      '',
      `${EMOJI.money} **Funding:**`,
      `/grants — All available grants`,
      `/grants\\_alaska — Alaska & US Federal grants`,
      `/grants\\_alberta — Alberta & Canada grants`,
      '',
      `${EMOJI.chart} **Project:**`,
      `/status — Project status dashboard`,
      `/company — Company overview`,
      '',
      `${EMOJI.brain} **AI Chat:**`,
      `Just send any message to chat with the AI!`,
      `The AI knows about our technology, patents,`,
      `grants, market, and Arctic energy systems.`,
      '',
      `_v${VERSION}_`,
    ].join('\n');

    ctx.reply(help, { parse_mode: 'Markdown' });
  });

  // ────────────────── /patent ──────────────────

  bot.command('patent', (ctx) => {
    log.info(`/patent from ${ctx.from.username || ctx.from.id}`);
    ctx.reply(formatPatentSummary(), { parse_mode: 'Markdown' });
  });

  // ────────────────── /grants ──────────────────

  bot.command('grants', (ctx) => {
    log.info(`/grants from ${ctx.from.username || ctx.from.id}`);
    ctx.reply(formatGrantsList('all'), { parse_mode: 'Markdown' });
  });

  bot.command('grants_alaska', (ctx) => {
    ctx.reply(formatGrantsList('alaska'), { parse_mode: 'Markdown' });
  });

  bot.command('grants_alberta', (ctx) => {
    ctx.reply(formatGrantsList('alberta'), { parse_mode: 'Markdown' });
  });

  // ────────────────── /status ──────────────────

  bot.command('status', (ctx) => {
    log.info(`/status from ${ctx.from.username || ctx.from.id}`);
    ctx.reply(formatProjectStatus(), { parse_mode: 'Markdown' });
  });

  // ────────────────── /company ──────────────────

  bot.command('company', (ctx) => {
    log.info(`/company from ${ctx.from.username || ctx.from.id}`);
    ctx.reply(formatCompanyOverview(), { parse_mode: 'Markdown' });
  });

  // ────────────────── /ask ──────────────────

  bot.command('ask', async (ctx) => {
    const question = ctx.message.text.replace(/^\/ask\s*/i, '').trim();

    if (!question) {
      return ctx.reply(
        `${EMOJI.brain} **Ask me anything!**\n\nUsage: /ask What temperature range does the TEG operate in?\n\nOr just send a message directly.`,
        { parse_mode: 'Markdown' }
      );
    }

    log.info(`/ask from ${ctx.from.username || ctx.from.id}: ${question.substring(0, 80)}`);

    // Show typing indicator
    ctx.sendChatAction('typing');

    const userId = `tg-${ctx.from.id}`;
    const response = await getAIResponse(userId, question);

    // Split long messages (Telegram limit: 4096 chars)
    if (response.length > 4000) {
      const chunks = splitMessage(response, 4000);
      for (const chunk of chunks) {
        await ctx.reply(chunk, { parse_mode: 'Markdown' }).catch(() => {
          ctx.reply(chunk); // Fallback without markdown
        });
      }
    } else {
      ctx.reply(response, { parse_mode: 'Markdown' }).catch(() => {
        ctx.reply(response); // Fallback without markdown
      });
    }
  });

  // ────────────────── /clear ──────────────────

  bot.command('clear', (ctx) => {
    const userId = `tg-${ctx.from.id}`;
    clearHistory(userId);
    ctx.reply(`${EMOJI.check} Conversation history cleared. Starting fresh!`);
    log.info(`/clear from ${ctx.from.username || ctx.from.id}`);
  });

  // ────────────────── /stats (admin) ──────────────────

  bot.command('stats', (ctx) => {
    const stats = getStats();
    ctx.reply(
      `${EMOJI.chart} **Bot Stats**\n\n` +
      `Active Conversations: ${stats.activeConversations}\n` +
      `Total Messages in Memory: ${stats.totalMessages}\n` +
      `Uptime: ${formatUptime(process.uptime())}`,
      { parse_mode: 'Markdown' }
    );
  });

  // ────────────────── Keyboard Button Handlers ──────────────────

  bot.hears(/^❄️ Company$/i, (ctx) => ctx.reply(formatCompanyOverview(), { parse_mode: 'Markdown' }));
  bot.hears(/^📄 Patent$/i, (ctx) => ctx.reply(formatPatentSummary(), { parse_mode: 'Markdown' }));
  bot.hears(/^💰 Grants$/i, (ctx) => ctx.reply(formatGrantsList('all'), { parse_mode: 'Markdown' }));
  bot.hears(/^📊 Status$/i, (ctx) => ctx.reply(formatProjectStatus(), { parse_mode: 'Markdown' }));
  bot.hears(/^🧠 Ask AI$/i, (ctx) => {
    ctx.reply(
      `${EMOJI.brain} **AI Chat Mode**\n\nJust type your question and I'll respond using Claude AI.\n\nExample questions:\n• How does the thermoelectric generator work?\n• What's the energy output at -40°C?\n• Tell me about the Arctic energy market\n• What patents are being filed?`,
      { parse_mode: 'Markdown' }
    );
  });

  // ────────────────── General Message Handler (AI Chat) ──────────────────

  bot.on('text', async (ctx) => {
    // Skip if it's a command (shouldn't get here, but safety check)
    if (ctx.message.text.startsWith('/')) return;

    const message = ctx.message.text.trim();
    if (!message) return;

    log.info(`Message from ${ctx.from.username || ctx.from.id}: ${message.substring(0, 80)}`);

    // Show typing indicator
    ctx.sendChatAction('typing');

    const userId = `tg-${ctx.from.id}`;
    const response = await getAIResponse(userId, message);

    // Split long messages
    if (response.length > 4000) {
      const chunks = splitMessage(response, 4000);
      for (const chunk of chunks) {
        await ctx.reply(chunk, { parse_mode: 'Markdown' }).catch(() => {
          ctx.reply(chunk);
        });
      }
    } else {
      ctx.reply(response, { parse_mode: 'Markdown' }).catch(() => {
        ctx.reply(response);
      });
    }
  });

  return bot;
}

// ────────────────────── Helpers ──────────────────────

function splitMessage(text, maxLen) {
  const chunks = [];
  let remaining = text;
  while (remaining.length > maxLen) {
    let splitAt = remaining.lastIndexOf('\n', maxLen);
    if (splitAt === -1 || splitAt < maxLen * 0.5) splitAt = maxLen;
    chunks.push(remaining.substring(0, splitAt));
    remaining = remaining.substring(splitAt).trimStart();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

// ────────────────────── Start Bot ──────────────────────

async function startTelegramBot() {
  const bot = createTelegramBot();

  // Set bot commands menu
  await bot.telegram.setMyCommands([
    { command: 'start', description: 'Welcome & quick menu' },
    { command: 'help', description: 'List all commands' },
    { command: 'ask', description: 'Ask the AI a question' },
    { command: 'patent', description: 'Patent status & claims' },
    { command: 'grants', description: 'Available grants & funding' },
    { command: 'status', description: 'Project status dashboard' },
    { command: 'company', description: 'Company overview' },
    { command: 'clear', description: 'Clear conversation history' },
  ]);

  // Set bot description
  await bot.telegram.setMyDescription(
    '❄️⚡ Arctic Electric AI — Resonance Energy Inc.\n\n' +
    '"The cold is the fuel. The cold never runs out."\n\n' +
    'Multi-modal Arctic energy harvesting technology.\n' +
    'Ask about our technology, patents, grants, and more!'
  ).catch(() => {});

  // Set bot short description
  await bot.telegram.setMyShortDescription(
    '❄️ Arctic Electric — Harvesting energy from the cold'
  ).catch(() => {});

  // Get bot info (validates token & populates botInfo)
  bot.botInfo = await bot.telegram.getMe();
  log.info(`Telegram bot connected: @${bot.botInfo.username}`);

  // Start polling — fire-and-forget (launch() runs an infinite loop)
  bot.launch({ dropPendingUpdates: true }).catch((err) => {
    log.error('Telegram polling error:', err.message);
  });

  log.info('Telegram bot polling started');

  // Graceful shutdown
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  return bot;
}

module.exports = { startTelegramBot, createTelegramBot };
