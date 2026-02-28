// ═══════════════════════════════════════════════════════════════
// Arctic Electric — Logger
// ═══════════════════════════════════════════════════════════════

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = LEVELS[process.env.LOG_LEVEL || 'info'] ?? LEVELS.info;

function timestamp() {
  return new Date().toISOString();
}

function log(level, prefix, message, data) {
  if (LEVELS[level] > currentLevel) return;
  const tag = `[${timestamp()}] [${level.toUpperCase()}] [${prefix}]`;
  if (data !== undefined) {
    console.log(`${tag} ${message}`, typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
  } else {
    console.log(`${tag} ${message}`);
  }
}

function createLogger(prefix) {
  return {
    error: (msg, data) => log('error', prefix, msg, data),
    warn: (msg, data) => log('warn', prefix, msg, data),
    info: (msg, data) => log('info', prefix, msg, data),
    debug: (msg, data) => log('debug', prefix, msg, data),
  };
}

module.exports = { createLogger };
