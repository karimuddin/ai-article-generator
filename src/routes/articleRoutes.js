const express = require('express');
const rateLimit = require('express-rate-limit');
const articleController = require('../controllers/articleController');
const validateRequest = require('../middleware/validateRequest');
const validationRules = require('../middleware/validation');
const config = require('../config/config');

const router = express.Router();

// Enhanced rate limiting for article generation
const articleLimiter = rateLimit({
  windowMs: config.rateLimit.articleGeneration.windowMs,
  max: config.rateLimit.articleGeneration.max,
  message: {
    success: false,
    error: 'Article generation limit exceeded. Please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// V1 API Routes (Advanced Features)
// Advanced article generation with AI pipeline
router.post('/v1/generate-advanced', 
  articleLimiter,
  validationRules.generateAdvancedArticle,
  validateRequest,
  articleController.generateAdvancedArticle
);

// Batch article generation
router.post('/v1/generate-batch',
  articleLimiter,
  validationRules.generateBatch,
  validateRequest,
  articleController.generateBatchArticles
);

// Configuration endpoints
router.post('/v1/configure',
  validationRules.configure,
  validateRequest,
  articleController.configure
);

router.get('/v1/config', articleController.getConfig);

// Enhanced health check
router.get('/v1/health', articleController.healthCheck);

// Article management with enhanced features
router.get('/v1/articles',
  validationRules.searchArticles,
  validateRequest,
  articleController.getAllArticles
);

router.get('/v1/articles/search',
  validationRules.searchArticles,
  validateRequest,
  articleController.searchArticles
);

router.get('/v1/articles/stats', articleController.getArticleStats);

router.get('/v1/articles/:id',
  validationRules.articleId,
  validateRequest,
  articleController.getArticle
);

router.delete('/v1/articles/:id',
  validationRules.articleId,
  validateRequest,
  articleController.deleteArticle
);

// Legacy API Routes (Backward Compatibility)
// Generate article (legacy endpoint)
router.post('/generate',
  articleLimiter,
  validationRules.generateArticle,
  validateRequest,
  articleController.generateArticle
);

// Get article templates
router.get('/templates', articleController.getTemplates);

// Preview article
router.post('/preview',
  validationRules.previewArticle,
  validateRequest,
  articleController.previewArticle
);

// Legacy article management
router.get('/:id',
  validationRules.articleId,
  validateRequest,
  articleController.getArticle
);

router.delete('/:id',
  validationRules.articleId,
  validateRequest,
  articleController.deleteArticle
);

module.exports = router;
