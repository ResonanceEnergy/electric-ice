// ═══════════════════════════════════════════════════════════════
// Arctic Electric — Discord Bot
// ═══════════════════════════════════════════════════════════════
//
//  Slash Commands:
//    /help     — List all commands
//    /ask      — Ask the AI anything
//    /patent   — Patent status & claims
//    /grants   — Available grants & funding
//    /status   — Project status dashboard
//    /company  — Company overview
//    /clear    — Clear conversation history
//    /stats    — Bot statistics
//
// ═══════════════════════════════════════════════════════════════

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActivityType,
  SlashCommandBuilder,
  REST,
  Routes,
  Collection,
  Events,
} = require('discord.js');

const { createLogger } = require('../shared/logger');
const { COLOR_PRIMARY, COLOR_SUCCESS, COLOR_PATENT, COLOR_GRANTS, COLOR_WARNING, EMOJI, SHORT_NAME, TAGLINE, VERSION } = require('../shared/branding');
const { getAIResponse, clearHistory, getStats } = require('../shared/ai');
const {
  PATENT,
  GRANTS,
  PROJECT_STATUS,
  COMPANY,
  formatPatentSummary,
  formatGrantsList,
  formatProjectStatus,
  formatCompanyOverview,
} = require('../shared/knowledge');

const log = createLogger('Discord');

// ────────────────────── Slash Command Definitions ──────────────────────

const commands = [
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all Arctic Electric bot commands'),

  new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ask the Arctic Electric AI anything')
    .addStringOption(opt =>
      opt.setName('question')
        .setDescription('Your question about Arctic Electric technology, patents, grants, etc.')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('patent')
    .setDescription('View patent status, claims, and innovation summary'),

  new SlashCommandBuilder()
    .setName('grants')
    .setDescription('Browse available grants and funding programs')
    .addStringOption(opt =>
      opt.setName('region')
        .setDescription('Filter by region')
        .addChoices(
          { name: 'All Regions', value: 'all' },
          { name: 'Alaska / US Federal', value: 'alaska' },
          { name: 'Alberta / Canada', value: 'alberta' },
        )
    ),

  new SlashCommandBuilder()
    .setName('status')
    .setDescription('View project status dashboard and milestones'),

  new SlashCommandBuilder()
    .setName('company')
    .setDescription('Company overview and technology summary'),

  new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear your AI conversation history'),

  new SlashCommandBuilder()
    .setName('stats')
    .setDescription('View bot statistics'),
];

// ────────────────────── Deploy Commands ──────────────────────

async function deployCommands() {
  const token = process.env.DISCORD_BOT_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!token || !clientId) {
    log.error('DISCORD_BOT_TOKEN and DISCORD_CLIENT_ID must be set');
    return false;
  }

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    const commandData = commands.map(cmd => cmd.toJSON());

    if (guildId) {
      // Guild-specific (instant update — for development)
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandData });
      log.info(`Deployed ${commandData.length} slash commands to guild ${guildId}`);
    } else {
      // Global (takes ~1 hour to propagate)
      await rest.put(Routes.applicationCommands(clientId), { body: commandData });
      log.info(`Deployed ${commandData.length} global slash commands`);
    }
    return true;
  } catch (error) {
    log.error('Failed to deploy slash commands:', error.message);
    return false;
  }
}

// ────────────────────── Create Bot ──────────────────────

function createDiscordBot() {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    log.error('DISCORD_BOT_TOKEN is not set in environment');
    process.exit(1);
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages,
    ],
  });

  // ────────────────── Ready Event ──────────────────

  client.once(Events.ClientReady, () => {
    log.info(`Discord bot logged in as ${client.user.tag}`);
    log.info(`Serving ${client.guilds.cache.size} server(s)`);

    // Set presence
    client.user.setPresence({
      activities: [{
        name: '❄️ Powering the Arctic',
        type: ActivityType.Custom,
      }],
      status: 'online',
    });
  });

  // ────────────────── Slash Command Handler ──────────────────

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, user } = interaction;
    log.info(`/${commandName} from ${user.username} (${user.id})`);

    try {
      switch (commandName) {
        case 'help':
          await handleHelp(interaction);
          break;
        case 'ask':
          await handleAsk(interaction);
          break;
        case 'patent':
          await handlePatent(interaction);
          break;
        case 'grants':
          await handleGrants(interaction);
          break;
        case 'status':
          await handleStatus(interaction);
          break;
        case 'company':
          await handleCompany(interaction);
          break;
        case 'clear':
          await handleClear(interaction);
          break;
        case 'stats':
          await handleBotStats(interaction);
          break;
        default:
          await interaction.reply({ content: 'Unknown command.', ephemeral: true });
      }
    } catch (error) {
      log.error(`Error handling /${commandName}:`, error.message);
      const reply = { content: '⚠️ Something went wrong. Please try again.', ephemeral: true };
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp(reply).catch(() => {});
      } else {
        await interaction.reply(reply).catch(() => {});
      }
    }
  });

  // ────────────────── Message Handler (mention/DM = AI chat) ──────────────────

  client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Respond to DMs or when mentioned
    const isMentioned = message.mentions.has(client.user);
    const isDM = !message.guild;

    if (!isMentioned && !isDM) return;

    let content = message.content;
    // Strip mention from message
    if (isMentioned) {
      content = content.replace(/<@!?\d+>/g, '').trim();
    }
    if (!content) {
      content = 'Hello! Tell me about Arctic Electric.';
    }

    log.info(`Chat from ${message.author.username}: ${content.substring(0, 80)}`);

    // Show typing
    await message.channel.sendTyping();

    const userId = `dc-${message.author.id}`;
    const response = await getAIResponse(userId, content);

    // Split long messages (Discord limit: 2000 chars)
    if (response.length > 1900) {
      const chunks = splitMessage(response, 1900);
      for (let i = 0; i < chunks.length; i++) {
        if (i === 0) {
          await message.reply(chunks[i]);
        } else {
          await message.channel.send(chunks[i]);
        }
      }
    } else {
      await message.reply(response);
    }
  });

  return client;
}

// ────────────────────── Command Handlers ──────────────────────

async function handleHelp(interaction) {
  const embed = new EmbedBuilder()
    .setColor(COLOR_PRIMARY)
    .setTitle(`${EMOJI.snowflake}${EMOJI.bolt} Arctic Electric — Commands`)
    .setDescription(`*"${TAGLINE}"*`)
    .addFields(
      {
        name: `${EMOJI.brain} AI Chat`,
        value: '`/ask` — Ask the AI anything\n**@mention** the bot or DM to chat freely',
        inline: false,
      },
      {
        name: `${EMOJI.docs} Patent & Technology`,
        value: '`/patent` — Patent status, claims & innovations',
        inline: true,
      },
      {
        name: `${EMOJI.money} Funding`,
        value: '`/grants` — Available grants & programs',
        inline: true,
      },
      {
        name: `${EMOJI.chart} Project`,
        value: '`/status` — Status dashboard\n`/company` — Company overview',
        inline: true,
      },
      {
        name: `${EMOJI.gear} Utility`,
        value: '`/clear` — Reset chat memory\n`/stats` — Bot statistics',
        inline: true,
      },
    )
    .setFooter({ text: `Arctic Electric AI v${VERSION}` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

async function handleAsk(interaction) {
  const question = interaction.options.getString('question');
  log.info(`/ask from ${interaction.user.username}: ${question.substring(0, 80)}`);

  // Defer reply (AI may take a moment)
  await interaction.deferReply();

  const userId = `dc-${interaction.user.id}`;
  const response = await getAIResponse(userId, question);

  // Build embed for the response
  const embed = new EmbedBuilder()
    .setColor(COLOR_PRIMARY)
    .setAuthor({ name: `${SHORT_NAME} AI` })
    .setDescription(response.substring(0, 4096))
    .setFooter({ text: `Asked by ${interaction.user.username}` })
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}

async function handlePatent(interaction) {
  const embed = new EmbedBuilder()
    .setColor(COLOR_PATENT)
    .setTitle(`${EMOJI.docs} Patent: ${PATENT.title}`)
    .addFields(
      { name: 'Status', value: PATENT.status, inline: true },
      { name: 'Filing Target', value: PATENT.filingTarget, inline: true },
      { name: 'Claims', value: PATENT.claimsCount, inline: true },
      { name: 'IPC Codes', value: PATENT.ipcCodes.join(', '), inline: false },
      {
        name: `${EMOJI.bolt} Key Innovations`,
        value: PATENT.keyInnovations.map((item, i) => `${i + 1}. ${item}`).join('\n'),
        inline: false,
      },
      {
        name: `${EMOJI.pin} Independent Claims`,
        value: PATENT.independentClaims.map(c => `• ${c}`).join('\n'),
        inline: false,
      },
      {
        name: `${EMOJI.microscope} Patent Figures`,
        value: PATENT.figures.map(f => `• ${f}`).join('\n'),
        inline: false,
      },
    )
    .setFooter({ text: `Arctic Electric AI v${VERSION}` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

async function handleGrants(interaction) {
  const region = interaction.options.getString('region') || 'all';

  const embed = new EmbedBuilder()
    .setColor(COLOR_GRANTS)
    .setTitle(`${EMOJI.money} Available Grants & Funding`)
    .setTimestamp();

  if (region === 'all' || region === 'alaska') {
    const usGrants = [...GRANTS.alaska, ...GRANTS.federal_us];
    const value = usGrants.map(g => {
      const icon = g.priority === 'HIGH' ? EMOJI.star : EMOJI.pin;
      return `${icon} **${g.name}** — ${g.amount}\n    Status: ${g.status} | Priority: ${g.priority}`;
    }).join('\n');
    embed.addFields({ name: '🇺🇸 Alaska / US Federal', value: value || 'None', inline: false });
  }

  if (region === 'all' || region === 'alberta') {
    const caGrants = GRANTS.alberta;
    const value = caGrants.map(g => {
      const icon = g.priority === 'HIGH' ? EMOJI.star : EMOJI.pin;
      return `${icon} **${g.name}** — ${g.amount}\n    Status: ${g.status} | Priority: ${g.priority}`;
    }).join('\n');
    embed.addFields({ name: '🇨🇦 Alberta / Canada', value: value || 'None', inline: false });
  }

  embed.setFooter({ text: `Use /grants region:alaska or /grants region:alberta to filter | v${VERSION}` });

  await interaction.reply({ embeds: [embed] });
}

async function handleStatus(interaction) {
  const milestoneText = PROJECT_STATUS.milestones.map(m => {
    const icon = m.status === 'COMPLETE' ? EMOJI.check : m.status === 'IN PROGRESS' ? EMOJI.gear : '⏳';
    return `${icon} **[${m.date}]** ${m.task} — _${m.status}_`;
  }).join('\n');

  const embed = new EmbedBuilder()
    .setColor(COLOR_SUCCESS)
    .setTitle(`${EMOJI.chart} Project Status Dashboard`)
    .addFields(
      { name: 'Phase', value: PROJECT_STATUS.phase, inline: true },
      { name: 'TRL', value: PROJECT_STATUS.trl, inline: true },
      { name: 'Funding Target', value: `${PROJECT_STATUS.funding.target}\n(${PROJECT_STATUS.funding.raised})`, inline: true },
      { name: `${EMOJI.calendar} Milestones`, value: milestoneText, inline: false },
      { name: `${EMOJI.team} Team`, value: PROJECT_STATUS.team.current, inline: true },
      { name: `${EMOJI.rocket} Hiring`, value: PROJECT_STATUS.team.hiring.join('\n'), inline: true },
    )
    .setFooter({ text: `Arctic Electric AI v${VERSION}` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

async function handleCompany(interaction) {
  const embed = new EmbedBuilder()
    .setColor(COLOR_PRIMARY)
    .setTitle(`${EMOJI.snowflake} ${COMPANY.dba} — ${COMPANY.legalName}`)
    .setDescription(`*"${TAGLINE}"*`)
    .addFields(
      { name: 'Type', value: COMPANY.type, inline: true },
      { name: 'HQ', value: COMPANY.hq, inline: true },
      { name: 'Expansion', value: COMPANY.expansion, inline: true },
      { name: 'Industry', value: COMPANY.industry, inline: false },
      { name: 'TAM', value: COMPANY.tam, inline: false },
      {
        name: `${EMOJI.globe} Target Markets`,
        value: COMPANY.targetMarkets.map(m => `• ${m}`).join('\n'),
        inline: false,
      },
      {
        name: `${EMOJI.bolt} Differentiation`,
        value: COMPANY.differentiation.map(d => `${EMOJI.star} ${d}`).join('\n'),
        inline: false,
      },
    )
    .setFooter({ text: `Arctic Electric AI v${VERSION}` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

async function handleClear(interaction) {
  const userId = `dc-${interaction.user.id}`;
  clearHistory(userId);
  await interaction.reply({
    content: `${EMOJI.check} Conversation history cleared. Starting fresh!`,
    ephemeral: true,
  });
}

async function handleBotStats(interaction) {
  const stats = getStats();
  const uptime = formatUptime(process.uptime());

  const embed = new EmbedBuilder()
    .setColor(COLOR_WARNING)
    .setTitle(`${EMOJI.chart} Bot Statistics`)
    .addFields(
      { name: 'Active Conversations', value: `${stats.activeConversations}`, inline: true },
      { name: 'Messages in Memory', value: `${stats.totalMessages}`, inline: true },
      { name: 'Uptime', value: uptime, inline: true },
      { name: 'Servers', value: `${interaction.client.guilds.cache.size}`, inline: true },
      { name: 'Ping', value: `${interaction.client.ws.ping}ms`, inline: true },
      { name: 'Version', value: VERSION, inline: true },
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
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
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  return `${h}h ${m}m`;
}

// ────────────────────── Start Bot ──────────────────────

async function startDiscordBot() {
  // Deploy slash commands first
  await deployCommands();

  // Create and login
  const client = createDiscordBot();
  await client.login(process.env.DISCORD_BOT_TOKEN);

  log.info('Discord bot started successfully');

  // Graceful shutdown
  process.once('SIGINT', () => { client.destroy(); });
  process.once('SIGTERM', () => { client.destroy(); });

  return client;
}

module.exports = { startDiscordBot, createDiscordBot, deployCommands };
