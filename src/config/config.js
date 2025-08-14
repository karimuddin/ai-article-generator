require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    credentials: true
  },
  
  // OpenAI configuration
  openai: {
    apiBaseUrl: process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1',
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 2500,
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
    apiUrl: (process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1') + '/chat/completions'
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    // Enhanced rate limiting for article generation
    articleGeneration: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10 // limit each IP to 10 article generations per hour
    }
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    logToFile: process.env.LOG_TO_FILE === 'true'
  },

  // Article generation defaults
  articleDefaults: {
    contentLength: 'medium',
    tone: 'professional',
    searchDepth: 10,
    recencyHours: 24,
    qualityThreshold: 7.0,
    autoOptimize: true,
    includeAnalytics: true,
    articleCount: 3
  },

  // Length specifications
  lengthSpecs: {
    short: { words: '800-1200', sections: 4, maxTokens: 1500 },
    medium: { words: '1200-1800', sections: 6, maxTokens: 2000 },
    long: { words: '1800-2500', sections: 8, maxTokens: 2500 }
  },

  // Valid tone options
  validTones: ['professional', 'casual', 'analytical', 'conversational', 'authoritative', 'engaging'],

  // API version
  apiVersion: '1.0.0'
};

module.exports = config;
