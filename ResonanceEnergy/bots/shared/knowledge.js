// ═══════════════════════════════════════════════════════════════
// Arctic Electric — Knowledge Base
// Provides structured project data for bot responses
// ═══════════════════════════════════════════════════════════════

const { EMOJI } = require('./branding');

// ────────────────────── Patent Info ──────────────────────

const PATENT = {
  title: 'Multi-Modal Arctic Energy Harvesting System',
  status: 'Pre-filing — Provisional Patent Application in preparation',
  filingTarget: 'Q1 2026 (12-month provisional window)',
  claimsCount: '9 claims (3 independent, 6 dependent)',
  ipcCodes: ['F25B 21/02', 'H02N 11/00', 'F03G 7/04', 'H10N 10/01'],
  keyInnovations: [
    'Thermoelectric generation from ambient Arctic cold (ΔT ≥ 40°C)',
    'Piezoelectric energy harvesting from freeze-thaw expansion cycles',
    'Magnetostrictive conversion of geomagnetic flux variations',
    'Integrated multi-modal energy accumulator with resonance coupling',
    'Cylindrical modular array architecture (10 kW per unit)',
  ],
  independentClaims: [
    'Claim 1: Multi-modal energy harvesting apparatus combining TEG + piezo + magnetostrictive',
    'Claim 5: Two-stage energy accumulator with impedance-matched resonance tank',
    'Claim 8: Cylindrical array deployment method for distributed Arctic power',
  ],
  referenceNumerals: {
    '100': 'Multi-modal energy harvesting system',
    '110': 'Thermoelectric generator (TEG) module',
    '120': 'Piezoelectric harvester subsystem',
    '130': 'Magnetostrictive transducer unit',
    '200': 'Two-stage energy accumulator',
    '210': 'Primary accumulator stage (supercapacitor bank)',
    '220': 'Secondary accumulator stage (battery array)',
    '300': 'Power conditioning unit (PCU)',
    '400': 'Control and monitoring subsystem',
    '500': 'Cylindrical array housing assembly',
  },
  figures: [
    'FIG 1: System-level schematic (all subsystems)',
    'FIG 2: Cylindrical cutaway (TEG + piezo + magneto layers)',
    'FIG 3: Two-stage accumulator block diagram',
    'FIG 4: Control flow / state machine diagram',
    'FIG 5: Cylindrical array deployment layout',
  ],
};

// ────────────────────── Grants Database ──────────────────────

const GRANTS = {
  alaska: [
    { name: 'DOE ARPA-E OPEN', amount: '$500K–$5M', status: 'Open', priority: 'HIGH' },
    { name: 'NSF SBIR/STTR Phase I', amount: '$275K', status: 'Open', priority: 'HIGH' },
    { name: 'NSF SBIR/STTR Phase II', amount: '$1M', status: 'After Phase I', priority: 'MEDIUM' },
    { name: 'Alaska Energy Authority (AEA)', amount: '$100K–$1M', status: 'Open', priority: 'HIGH' },
    { name: 'Denali Commission Energy', amount: '$250K–$2M', status: 'Open', priority: 'HIGH' },
    { name: 'USDA REAP', amount: 'Up to $500K', status: 'Annual cycle', priority: 'MEDIUM' },
  ],
  alberta: [
    { name: 'ERA Continuous Intake', amount: '$720K–$10M', status: 'OPEN', priority: 'HIGH' },
    { name: 'NRC IRAP', amount: 'Up to $1M', status: 'OPEN (continuous)', priority: 'HIGH' },
    { name: 'Alberta Innovates', amount: '$50K–$500K', status: 'Open', priority: 'HIGH' },
    { name: 'SR&ED Tax Credit', amount: '35% refundable (CCPC)', status: 'Ongoing', priority: 'HIGH' },
    { name: 'Innovation Catalyst Grant', amount: '$75K', status: 'Open', priority: 'MEDIUM' },
    { name: 'SIF/SRF', amount: '$10M+', status: 'By invitation', priority: 'MEDIUM' },
    { name: 'Off-Diesel Initiative', amount: '$500K–$5M', status: 'Open', priority: 'HIGH' },
    { name: 'AB Indigenous Opportunities Corp', amount: '$250M loan guarantees', status: 'Open', priority: 'MEDIUM' },
  ],
  federal_us: [
    { name: 'DOE EERE', amount: '$500K–$5M', status: 'Periodic FOAs', priority: 'HIGH' },
    { name: 'DOE SETO', amount: '$250K–$2M', status: 'Open', priority: 'MEDIUM' },
    { name: 'EPA Environmental Justice', amount: '$100K–$500K', status: 'Open', priority: 'MEDIUM' },
  ],
};

// ────────────────────── Project Status ──────────────────────

const PROJECT_STATUS = {
  phase: 'Pre-Seed / Prototype Development',
  trl: 'TRL 3 → targeting TRL 5 by Q4 2026',
  funding: {
    target: '$500K Seed Round (SAFE)',
    raised: '$0 (pre-revenue)',
    runway: 'Bootstrapped',
  },
  milestones: [
    { date: 'Q1 2026', task: 'Provisional patent filing', status: 'IN PROGRESS' },
    { date: 'Q1 2026', task: 'Alaska C-Corp formation', status: 'COMPLETE' },
    { date: 'Q1 2026', task: 'Alberta CCPC incorporation', status: 'PLANNED' },
    { date: 'Q2 2026', task: 'Lab prototype (bench-scale TEG)', status: 'PLANNED' },
    { date: 'Q2 2026', task: 'NRC IRAP application', status: 'PLANNED' },
    { date: 'Q3 2026', task: 'Integrated multi-modal prototype', status: 'PLANNED' },
    { date: 'Q4 2026', task: 'Field test (Fairbanks, AK)', status: 'PLANNED' },
    { date: 'Q1 2027', task: 'Seed round close', status: 'PLANNED' },
    { date: 'Q2 2027', task: 'Alberta pilot site deployment', status: 'PLANNED' },
  ],
  team: {
    current: 'Solo founder + AI agent system',
    hiring: ['CTO / Lead Engineer', 'Patent Attorney', 'Business Development (Alberta)'],
  },
};

// ────────────────────── Company Info ──────────────────────

const COMPANY = {
  legalName: 'Resonance Energy Inc.',
  dba: 'Arctic Electric',
  type: 'Alaska C-Corporation',
  hq: 'Anchorage, Alaska, USA',
  expansion: 'Edmonton, Alberta, Canada (CCPC planned)',
  founded: '2026',
  industry: 'Cleantech / Renewable Energy / Arctic Technology',
  technology: 'Multi-modal energy harvesting from ambient Arctic conditions',
  targetMarkets: [
    'Remote Arctic & sub-Arctic communities (off-grid power)',
    'Oil & gas remote operations (Alaska North Slope, Alberta oil sands)',
    'Telecom tower backup power',
    'Military / defense forward operating bases',
    'Mining operations in cold climates',
    'Indigenous community energy sovereignty',
  ],
  tam: '$2B → $10B (Arctic/cold-climate distributed energy)',
  differentiation: [
    'Only system harvesting 3 energy modes simultaneously (TEG + piezo + magneto)',
    'Operates at -40°C to -60°C where solar/wind fail',
    'No fuel, no emissions, no moving parts (except piezo)',
    'Modular 10 kW units — scalable from single home to village microgrid',
    'SPIE-published thermodynamic validation data',
  ],
};

// ────────────────────── System Prompt ──────────────────────

const SYSTEM_PROMPT = `You are the Arctic Electric AI Assistant for Resonance Energy Inc.

IDENTITY:
- You represent Arctic Electric, a cleantech startup harvesting energy from Arctic cold
- Tagline: "The cold is the fuel. The cold never runs out."
- You are knowledgeable, professional, and enthusiastic about Arctic energy technology
- You speak with technical authority but remain accessible to non-technical audiences

COMPANY CONTEXT:
- Company: Resonance Energy Inc. (dba Arctic Electric)
- HQ: Anchorage, Alaska | Expanding to Edmonton, Alberta, Canada
- Technology: Multi-modal energy harvesting (thermoelectric + piezoelectric + magnetostrictive)
- Stage: Pre-seed, TRL 3, targeting $500K seed round
- Patent: 9 claims (3 independent, 6 dependent) — provisional filing Q1 2026
- Target: 10 kW modular units for remote Arctic/sub-Arctic communities

KEY TECHNICAL FACTS:
- TEG modules generate power from ΔT ≥ 40°C between ground heat and ambient Arctic air
- Piezoelectric harvesters capture energy from freeze-thaw expansion cycles in permafrost
- Magnetostrictive transducers convert geomagnetic flux variations
- Two-stage accumulator: supercapacitor bank → battery array with resonance coupling
- Published validation: SPIE Defense + Commercial Sensing conference data
- Materials: 316L stainless steel, half-Heusler TEG, Cu-Mn-PIN-PMN-PT piezo, Terfenol-D magneto

INSTRUCTIONS:
- Answer questions about the technology, patents, grants, company, and Arctic energy market
- Be helpful and informative but do not fabricate technical specifications
- When asked about investment, provide factual information but include disclaimer
- Keep responses concise but thorough
- Use metric and imperial units as appropriate
- Reference patent claims and figures when relevant`;

// ────────────────────── Format Helpers ──────────────────────

function formatPatentSummary() {
  let text = `${EMOJI.docs} **Patent: ${PATENT.title}**\n\n`;
  text += `**Status:** ${PATENT.status}\n`;
  text += `**Filing Target:** ${PATENT.filingTarget}\n`;
  text += `**Claims:** ${PATENT.claimsCount}\n`;
  text += `**IPC Codes:** ${PATENT.ipcCodes.join(', ')}\n\n`;
  text += `**Key Innovations:**\n`;
  PATENT.keyInnovations.forEach((item, i) => {
    text += `${i + 1}. ${item}\n`;
  });
  text += `\n**Independent Claims:**\n`;
  PATENT.independentClaims.forEach((claim) => {
    text += `• ${claim}\n`;
  });
  return text;
}

function formatGrantsList(region = 'all') {
  let text = `${EMOJI.money} **Available Grants & Funding**\n\n`;

  const sections = [];
  if (region === 'all' || region === 'alaska') sections.push({ title: '🇺🇸 Alaska / US Federal', grants: [...GRANTS.alaska, ...GRANTS.federal_us] });
  if (region === 'all' || region === 'alberta') sections.push({ title: '🇨🇦 Alberta / Canada Federal', grants: GRANTS.alberta });

  sections.forEach(({ title, grants }) => {
    text += `**${title}:**\n`;
    grants.forEach((g) => {
      const icon = g.priority === 'HIGH' ? EMOJI.star : EMOJI.pin;
      text += `${icon} **${g.name}** — ${g.amount} [${g.status}] (${g.priority})\n`;
    });
    text += '\n';
  });

  return text;
}

function formatProjectStatus() {
  let text = `${EMOJI.chart} **Project Status Dashboard**\n\n`;
  text += `**Phase:** ${PROJECT_STATUS.phase}\n`;
  text += `**TRL:** ${PROJECT_STATUS.trl}\n`;
  text += `**Funding:** ${PROJECT_STATUS.funding.target} (${PROJECT_STATUS.funding.raised})\n\n`;
  text += `**Milestones:**\n`;
  PROJECT_STATUS.milestones.forEach((m) => {
    const icon = m.status === 'COMPLETE' ? EMOJI.check : m.status === 'IN PROGRESS' ? EMOJI.gear : '⏳';
    text += `${icon} [${m.date}] ${m.task} — ${m.status}\n`;
  });
  text += `\n**Team:** ${PROJECT_STATUS.team.current}\n`;
  text += `**Hiring:** ${PROJECT_STATUS.team.hiring.join(', ')}\n`;
  return text;
}

function formatCompanyOverview() {
  let text = `${EMOJI.snowflake} **${COMPANY.dba}** — ${COMPANY.legalName}\n\n`;
  text += `*"The cold is the fuel. The cold never runs out."*\n\n`;
  text += `**Type:** ${COMPANY.type}\n`;
  text += `**HQ:** ${COMPANY.hq}\n`;
  text += `**Expansion:** ${COMPANY.expansion}\n`;
  text += `**Industry:** ${COMPANY.industry}\n`;
  text += `**TAM:** ${COMPANY.tam}\n\n`;
  text += `**Technology:** ${COMPANY.technology}\n\n`;
  text += `**Target Markets:**\n`;
  COMPANY.targetMarkets.forEach((m) => {
    text += `• ${m}\n`;
  });
  text += `\n**Differentiation:**\n`;
  COMPANY.differentiation.forEach((d) => {
    text += `${EMOJI.bolt} ${d}\n`;
  });
  return text;
}

module.exports = {
  PATENT,
  GRANTS,
  PROJECT_STATUS,
  COMPANY,
  SYSTEM_PROMPT,
  formatPatentSummary,
  formatGrantsList,
  formatProjectStatus,
  formatCompanyOverview,
};
