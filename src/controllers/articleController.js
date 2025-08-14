const articleService = require('../services/articleService');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

const articleController = {
  // Advanced AI-powered article generation
  generateAdvancedArticle: asyncHandler(async (req, res) => {
    const startTime = Date.now();
    
    const {
      topic,
      article_count = config.articleDefaults.articleCount,
      content_length = config.articleDefaults.contentLength,
      tone = config.articleDefaults.tone,
      search_depth = config.articleDefaults.searchDepth,
      recency_hours = config.articleDefaults.recencyHours,
      quality_threshold = config.articleDefaults.qualityThreshold,
      seo_keywords = '',
      auto_optimize = config.articleDefaults.autoOptimize,
      include_analytics = config.articleDefaults.includeAnalytics,
      custom_prompt_addition = '',
      exclude_sources = ''
    } = req.body;

    const result = await articleService.generateAdvancedArticle({
      topic,
      article_count,
      content_length,
      tone,
      search_depth,
      recency_hours,
      quality_threshold,
      seo_keywords,
      auto_optimize,
      include_analytics,
      custom_prompt_addition,
      exclude_sources
    });

    res.status(201).json(new ApiResponse(201, {
      success: true,
      article: result.result,
      trending_topics_analyzed: result.trending_topics_analyzed,
      candidates_generated: result.candidates_generated,
      processing_time_ms: result.processing_time_ms,
      parameters_used: {
        topic,
        content_length,
        tone,
        search_depth,
        recency_hours,
        seo_optimized: auto_optimize
      },
      ...(result.performance_prediction && { performance_prediction: result.performance_prediction })
    }, 'Advanced article generated successfully'));
  }),

  // Batch article generation
  generateBatchArticles: asyncHandler(async (req, res) => {
    const { topics, ...sharedParams } = req.body;
    
    const results = await articleService.generateBatchArticles(topics, sharedParams);
    
    res.status(201).json(new ApiResponse(201, results, 'Batch articles generated successfully'));
  }),

  // Legacy article generation (for backward compatibility)
  generateArticle: asyncHandler(async (req, res) => {
    const {
      topic,
      keywords = [],
      tone = 'professional',
      wordCount = 1000,
      includeImages = false,
      seoOptimized = true
    } = req.body;

    const articleData = {
      topic,
      keywords,
      tone,
      wordCount,
      includeImages,
      seoOptimized
    };

    const result = await articleService.generateArticle(articleData);
    
    res.status(201).json(new ApiResponse(201, result, 'Article generated successfully'));
  }),

  // Get article templates with enhanced information
  getTemplates: asyncHandler(async (req, res) => {
    const templates = await articleService.getTemplates();
    res.status(200).json(new ApiResponse(200, templates, 'Templates retrieved successfully'));
  }),

  // Preview article without full generation
  previewArticle: asyncHandler(async (req, res) => {
    const {
      topic,
      keywords = [],
      tone = 'professional'
    } = req.body;

    const preview = await articleService.generatePreview({ topic, keywords, tone });
    res.status(200).json(new ApiResponse(200, preview, 'Article preview generated successfully'));
  }),

  // Get specific article by ID
  getArticle: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await articleService.getArticleById(id);
    
    if (!article) {
      throw new ApiError(404, 'Article not found');
    }
    
    res.status(200).json(new ApiResponse(200, article, 'Article retrieved successfully'));
  }),

  // Get all articles with optional filtering
  getAllArticles: asyncHandler(async (req, res) => {
    const { topic, tone, length, limit = 10, offset = 0 } = req.query;
    
    let articles = await articleService.getAllArticles();
    
    // Apply filters
    if (topic) {
      articles = articles.filter(article => 
        article.topic.toLowerCase().includes(topic.toLowerCase())
      );
    }
    
    if (tone) {
      articles = articles.filter(article => article.tone === tone);
    }
    
    if (length) {
      articles = articles.filter(article => article.content_length === length);
    }
    
    // Apply pagination
    const total = articles.length;
    const paginatedArticles = articles.slice(offset, offset + limit);
    
    res.status(200).json(new ApiResponse(200, {
      articles: paginatedArticles,
      pagination: {
        total,
        limit,
        offset,
        has_more: offset + limit < total
      }
    }, 'Articles retrieved successfully'));
  }),

  // Search articles by topic
  searchArticles: asyncHandler(async (req, res) => {
    const { topic } = req.query;
    
    if (!topic) {
      throw new ApiError(400, 'Search topic is required');
    }
    
    const articles = await articleService.getArticlesByTopic(topic);
    res.status(200).json(new ApiResponse(200, articles, 'Articles found successfully'));
  }),

  // Get article statistics
  getArticleStats: asyncHandler(async (req, res) => {
    const stats = await articleService.getArticleStats();
    res.status(200).json(new ApiResponse(200, stats, 'Article statistics retrieved successfully'));
  }),

  // Delete article by ID
  deleteArticle: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleted = await articleService.deleteArticle(id);
    
    if (!deleted) {
      throw new ApiError(404, 'Article not found');
    }
    
    res.status(200).json(new ApiResponse(200, null, 'Article deleted successfully'));
  }),

  // Configuration endpoint for API key setup
  configure: asyncHandler(async (req, res) => {
    const { openai_api_key } = req.body;
    
    // In a production environment, you'd want to validate the API key
    // and store it securely (e.g., in a database or environment variable)
    process.env.OPENAI_API_KEY = openai_api_key;
    
    res.status(200).json(new ApiResponse(200, {
      message: 'API key configured successfully',
      api_key_configured: true
    }, 'Configuration updated successfully'));
  }),

  // Get API configuration and capabilities
  getConfig: asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, {
      endpoints: {
        generate_advanced_article: '/api/v1/articles/generate-advanced',
        generate_batch: '/api/v1/articles/generate-batch',
        generate_article: '/api/articles/generate',
        preview: '/api/articles/preview',
        templates: '/api/articles/templates',
        health: '/health',
        configure: '/api/v1/configure'
      },
      parameters: {
        required: ['topic'],
        optional: [
          'article_count', 'content_length', 'tone', 'search_depth',
          'recency_hours', 'quality_threshold', 'seo_keywords',
          'auto_optimize', 'include_analytics', 'custom_prompt_addition',
          'exclude_sources'
        ]
      },
      limits: {
        requests_per_hour: config.rateLimit.articleGeneration.max,
        max_topic_length: 200,
        max_article_count: 5,
        max_batch_topics: 5
      },
      valid_tones: config.validTones,
      valid_lengths: Object.keys(config.lengthSpecs),
      api_version: config.apiVersion
    }, 'Configuration retrieved successfully'));
  }),

  // Health check with enhanced information
  healthCheck: asyncHandler(async (req, res) => {
    const stats = await articleService.getArticleStats();
    
    res.status(200).json(new ApiResponse(200, {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      api_key_configured: !!config.openai.apiKey,
      node_version: process.version,
      api_version: config.apiVersion,
      uptime_seconds: Math.floor(process.uptime()),
      environment: config.nodeEnv,
      total_articles_generated: stats.total_articles
    }, 'Service is healthy'));
  })
};

module.exports = articleController;
