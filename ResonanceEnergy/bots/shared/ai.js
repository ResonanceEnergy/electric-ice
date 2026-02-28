// ═══════════════════════════════════════════════════════════════
// Arctic Electric — AI Client (Anthropic Claude)
// ═══════════════════════════════════════════════════════════════

const Anthropic = require('@anthropic-ai/sdk');
const { SYSTEM_PROMPT } = require('./knowledge');

let client = null;

function getClient() {
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return client;
}

// Conversation history per user (in-memory, resets on restart)
const conversations = new Map();
const MAX_HISTORY = 20; // Max messages per user conversation

/**
 * Get AI response from Claude
 * @param {string} userId - Unique user identifier (platform-prefixed)
 * @param {string} message - User's message
 * @param {object} options - Additional options
 * @returns {Promise<string>} AI response text
 */
async function getAIResponse(userId, message, options = {}) {
  const anthropic = getClient();

  // Get or create conversation history
  if (!conversations.has(userId)) {
    conversations.set(userId, []);
  }
  const history = conversations.get(userId);

  // Add user message to history
  history.push({ role: 'user', content: message });

  // Trim history if too long
  while (history.length > MAX_HISTORY) {
    history.shift();
  }

  try {
    const response = await anthropic.messages.create({
      model: options.model || 'claude-sonnet-4-20250514',
      max_tokens: options.maxTokens || 1024,
      system: SYSTEM_PROMPT,
      messages: history,
    });

    const assistantMessage = response.content[0].text;

    // Add assistant response to history
    history.push({ role: 'assistant', content: assistantMessage });

    return assistantMessage;
  } catch (error) {
    console.error(`[AI] Error for user ${userId}:`, error.message);

    // Remove the failed user message from history
    history.pop();

    if (error.status === 429) {
      return '⚠️ I\'m receiving too many requests right now. Please try again in a moment.';
    }
    if (error.status === 401) {
      return '⚠️ AI service authentication error. Please contact the administrator.';
    }
    return '⚠️ I encountered an error processing your request. Please try again.';
  }
}

/**
 * Clear conversation history for a user
 * @param {string} userId
 */
function clearHistory(userId) {
  conversations.delete(userId);
}

/**
 * Get conversation stats
 */
function getStats() {
  return {
    activeConversations: conversations.size,
    totalMessages: Array.from(conversations.values()).reduce((sum, h) => sum + h.length, 0),
  };
}

module.exports = {
  getAIResponse,
  clearHistory,
  getStats,
};
