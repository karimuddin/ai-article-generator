const express = require('express');
const articleRoutes = require('./articleRoutes');
const config = require('../config/config');

const router = express.Router();

// API version and info
router.get('/', (req, res) => {
  res.json({
    name: 'AI Article Generator API',
    version: config.apiVersion,
    description: 'AI-powered automated article generation pipeline with advanced features',
    features: [
      'Advanced AI article generation',
      'Trending topic analysis',
      'Multi-candidate generation',
      'AI-powered article selection',
      'SEO optimization',
      'Performance prediction',
      'Batch processing',
      'Real-time analytics'
    ],
    endpoints: {
      // V1 API (Advanced features)
      generate_advanced_article: '/api/articles/v1/generate-advanced',
      generate_batch: '/api/articles/v1/generate-batch',
      health_check: '/api/articles/v1/health',
      configuration: '/api/articles/v1/config',
      article_management: '/api/articles/v1/articles',
      article_search: '/api/articles/v1/articles/search',
      article_stats: '/api/articles/v1/articles/stats',
      
      // Legacy API (Backward compatibility)
      articles: '/api/articles',
      templates: '/api/articles/templates',
      preview: '/api/articles/preview',
      health: '/health'
    },
    documentation: {
      interactive_docs: '/docs',
      api_reference: '/api/articles/v1/config'
    },
    rate_limits: {
      general_api: `${config.rateLimit.max} requests per ${config.rateLimit.windowMs / 60000} minutes`,
      article_generation: `${config.rateLimit.articleGeneration.max} requests per ${config.rateLimit.articleGeneration.windowMs / 3600000} hour`
    }
  });
});

// Mount article routes
router.use('/articles', articleRoutes);

module.exports = router;
