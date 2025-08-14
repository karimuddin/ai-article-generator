const { body, query, param } = require('express-validator');
const config = require('../config/config');

/**
 * Enhanced validation middleware for AI article generation
 */
const validationRules = {
  // Advanced article generation validation
  generateAdvancedArticle: [
    body('topic')
      .notEmpty()
      .withMessage('Topic is required')
      .isLength({ min: 3, max: 200 })
      .withMessage('Topic must be between 3 and 200 characters')
      .trim()
      .escape(),
    
    body('article_count')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Article count must be between 1 and 5')
      .toInt(),
    
    body('content_length')
      .optional()
      .isIn(Object.keys(config.lengthSpecs))
      .withMessage(`Content length must be one of: ${Object.keys(config.lengthSpecs).join(', ')}`),
    
    body('tone')
      .optional()
      .isIn(config.validTones)
      .withMessage(`Tone must be one of: ${config.validTones.join(', ')}`),
    
    body('search_depth')
      .optional()
      .isInt({ min: 5, max: 20 })
      .withMessage('Search depth must be between 5 and 20')
      .toInt(),
    
    body('recency_hours')
      .optional()
      .isInt({ min: 6, max: 72 })
      .withMessage('Recency hours must be between 6 and 72')
      .toInt(),
    
    body('quality_threshold')
      .optional()
      .isFloat({ min: 1.0, max: 10.0 })
      .withMessage('Quality threshold must be between 1.0 and 10.0')
      .toFloat(),
    
    body('seo_keywords')
      .optional()
      .isLength({ max: 500 })
      .withMessage('SEO keywords must not exceed 500 characters')
      .trim(),
    
    body('auto_optimize')
      .optional()
      .isBoolean()
      .withMessage('Auto optimize must be a boolean')
      .toBoolean(),
    
    body('include_analytics')
      .optional()
      .isBoolean()
      .withMessage('Include analytics must be a boolean')
      .toBoolean(),
    
    body('custom_prompt_addition')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Custom prompt addition must not exceed 1000 characters')
      .trim(),
    
    body('exclude_sources')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Exclude sources must not exceed 500 characters')
      .trim()
  ],

  // Batch generation validation
  generateBatch: [
    body('topics')
      .isArray({ min: 1, max: 5 })
      .withMessage('Topics must be an array with 1-5 items'),
    
    body('topics.*')
      .notEmpty()
      .withMessage('Each topic must be non-empty')
      .isLength({ min: 3, max: 200 })
      .withMessage('Each topic must be between 3 and 200 characters')
      .trim()
      .escape(),
    
    body('content_length')
      .optional()
      .isIn(Object.keys(config.lengthSpecs))
      .withMessage(`Content length must be one of: ${Object.keys(config.lengthSpecs).join(', ')}`),
    
    body('tone')
      .optional()
      .isIn(config.validTones)
      .withMessage(`Tone must be one of: ${config.validTones.join(', ')}`),
    
    body('auto_optimize')
      .optional()
      .isBoolean()
      .withMessage('Auto optimize must be a boolean')
      .toBoolean(),
    
    body('include_analytics')
      .optional()
      .isBoolean()
      .withMessage('Include analytics must be a boolean')
      .toBoolean()
  ],

  // Legacy article generation validation (backward compatibility)
  generateArticle: [
    body('topic')
      .notEmpty()
      .withMessage('Topic is required')
      .isLength({ min: 3, max: 200 })
      .withMessage('Topic must be between 3 and 200 characters'),
    
    body('keywords')
      .optional()
      .isArray()
      .withMessage('Keywords must be an array'),
    
    body('tone')
      .optional()
      .isIn(['professional', 'casual', 'academic', 'creative'])
      .withMessage('Tone must be one of: professional, casual, academic, creative'),
    
    body('wordCount')
      .optional()
      .isInt({ min: 100, max: 5000 })
      .withMessage('Word count must be between 100 and 5000'),
    
    body('includeImages')
      .optional()
      .isBoolean()
      .withMessage('includeImages must be a boolean'),
    
    body('seoOptimized')
      .optional()
      .isBoolean()
      .withMessage('seoOptimized must be a boolean')
  ],

  // Preview generation validation
  previewArticle: [
    body('topic')
      .notEmpty()
      .withMessage('Topic is required')
      .isLength({ min: 3, max: 200 })
      .withMessage('Topic must be between 3 and 200 characters'),
    
    body('keywords')
      .optional()
      .isArray()
      .withMessage('Keywords must be an array'),
    
    body('tone')
      .optional()
      .isIn(config.validTones)
      .withMessage(`Tone must be one of: ${config.validTones.join(', ')}`)
  ],

  // Configuration validation
  configure: [
    body('openai_api_key')
      .notEmpty()
      .withMessage('OpenAI API key is required')
      .isLength({ min: 20 })
      .withMessage('API key appears to be invalid (too short)')
  ],

  // Article ID validation
  articleId: [
    param('id')
      .isUUID()
      .withMessage('Invalid article ID format')
  ],

  // Search validation
  searchArticles: [
    query('topic')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search topic must be between 1 and 100 characters')
      .trim(),
    
    query('tone')
      .optional()
      .isIn(config.validTones)
      .withMessage(`Tone must be one of: ${config.validTones.join(', ')}`),
    
    query('length')
      .optional()
      .isIn(Object.keys(config.lengthSpecs))
      .withMessage(`Length must be one of: ${Object.keys(config.lengthSpecs).join(', ')}`),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
      .toInt(),
    
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be a non-negative integer')
      .toInt()
  ]
};

module.exports = validationRules;
