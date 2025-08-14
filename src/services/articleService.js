const openaiService = require('./openaiService');
const seoService = require('./seoService');
const config = require('../config/config');
const { v4: uuidv4 } = require('uuid');

// In-memory storage (replace with database in production)
const articles = new Map();

/**
 * Enhanced Article Service for AI-powered article generation
 */
const articleService = {
  /**
   * Advanced article generation with AI pipeline
   */
  async generateAdvancedArticle(articleData) {
    const startTime = Date.now();
    
    try {
      // Extract and set defaults for parameters
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
      } = articleData;

      openaiService.logDebug('Starting advanced article generation', { 
        topic, article_count, content_length, tone 
      });

      // Step 1: Web Scraping and Trend Analysis
      const trendingTopics = await openaiService.getTrendingTopics(
        topic, search_depth, recency_hours, exclude_sources
      );
      
      if (!trendingTopics || trendingTopics.length === 0) {
        throw new Error('No trending topics found for the specified criteria');
      }

      openaiService.logDebug('Trending topics analyzed', { count: trendingTopics.length });

      // Step 2: Generate Multiple Article Candidates
      const articleCandidates = [];
      const maxCandidates = Math.min(article_count, trendingTopics.length);
      
      for (let i = 0; i < maxCandidates; i++) {
        try {
          const candidate = await openaiService.generateArticleCandidate(
            trendingTopics[i],
            content_length,
            tone,
            seo_keywords,
            custom_prompt_addition
          );
          articleCandidates.push(candidate);
        } catch (error) {
          openaiService.logDebug(`Failed to generate candidate ${i + 1}`, error.message);
        }
      }

      if (articleCandidates.length === 0) {
        throw new Error('All article generation attempts failed');
      }

      openaiService.logDebug('Article candidates generated', { count: articleCandidates.length });

      // Step 3: Select Best Article Using AI Analysis
      const bestArticle = await openaiService.selectBestArticle(
        articleCandidates, topic, quality_threshold
      );
      
      if (!bestArticle || !bestArticle.selected_article) {
        throw new Error('Article selection process failed');
      }

      openaiService.logDebug('Best article selected', { 
        index: bestArticle.selected_article.article_index,
        quality_score: bestArticle.selection_reasoning?.quality_score 
      });

      // Step 4: SEO Optimization and Proofreading
      let finalArticle = bestArticle;
      if (auto_optimize) {
        try {
          const optimizedArticle = await openaiService.optimizeArticle(
            bestArticle, seo_keywords, topic
          );
          if (optimizedArticle && optimizedArticle.optimized_article) {
            finalArticle = optimizedArticle;
          }
          openaiService.logDebug('Article optimized successfully');
        } catch (error) {
          openaiService.logDebug('Optimization failed, using original article', error.message);
        }
      }

      // Step 5: Performance Prediction (if enabled)
      let performancePrediction = null;
      if (include_analytics) {
        try {
          performancePrediction = await openaiService.predictPerformance(finalArticle, topic);
          openaiService.logDebug('Performance prediction completed');
        } catch (error) {
          openaiService.logDebug('Performance prediction failed', error.message);
        }
      }

      // Create article object and store
      const article = {
        id: uuidv4(),
        topic,
        content_length,
        tone,
        search_depth,
        recency_hours,
        quality_threshold,
        seo_keywords,
        auto_optimize,
        include_analytics,
        trending_topics_analyzed: trendingTopics.length,
        candidates_generated: articleCandidates.length,
        processing_time_ms: Date.now() - startTime,
        result: finalArticle,
        performance_prediction: performancePrediction,
        createdAt: new Date().toISOString(),
        status: 'generated'
      };

      // Store article
      articles.set(article.id, article);

      openaiService.logDebug('Article generation completed successfully', { 
        processing_time_ms: article.processing_time_ms,
        article_title: finalArticle.optimized_article?.title || finalArticle.selected_article?.title
      });

      return article;

    } catch (error) {
      console.error('Advanced article generation failed:', error);
      throw error;
    }
  },

  /**
   * Batch article generation
   */
  async generateBatchArticles(topics, sharedParams = {}) {
    const results = [];
    const startTime = Date.now();

    for (const [index, topic] of topics.entries()) {
      try {
        const requestData = { topic, ...sharedParams };
        const result = await this.generateAdvancedArticle(requestData);
        
        results.push({
          topic,
          index,
          status: 'success',
          article_id: result.id,
          processing_time_ms: result.processing_time_ms
        });
        
        // Add delay between requests to avoid rate limiting
        if (index < topics.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (error) {
        results.push({
          topic,
          index,
          status: 'error',
          error: error.message
        });
      }
    }

    return {
      batch_results: results,
      total_topics: topics.length,
      successful_generations: results.filter(r => r.status === 'success').length,
      processing_time_ms: Date.now() - startTime
    };
  },

  /**
   * Legacy article generation (for backward compatibility)
   */
  async generateArticle(articleData) {
    const {
      topic,
      keywords = [],
      tone = 'professional',
      wordCount = 1000,
      includeImages = false,
      seoOptimized = true
    } = articleData;

    // Convert legacy parameters to advanced format
    const advancedData = {
      topic,
      seo_keywords: keywords.join(', '),
      tone,
      content_length: wordCount > 1500 ? 'long' : wordCount > 1000 ? 'medium' : 'short',
      auto_optimize: seoOptimized,
      include_analytics: true,
      article_count: 1
    };

    const result = await this.generateAdvancedArticle(advancedData);
    
    // Convert back to legacy format
    const finalArticle = result.result.optimized_article || result.result.selected_article;
    
    return {
      id: result.id,
      title: finalArticle.title,
      subtitle: finalArticle.subtitle,
      content: finalArticle.content,
      topic,
      keywords,
      tone,
      wordCount: this.countWords(finalArticle.content),
      includeImages,
      seoOptimized,
      seoData: result.performance_prediction,
      createdAt: result.createdAt,
      status: result.status
    };
  },

  async generatePreview(previewData) {
    const { topic, keywords, tone } = previewData;

    const title = await openaiService.generateTitle(topic, tone);
    const outline = await openaiService.generateOutline(topic, keywords, tone);

    return {
      title,
      outline,
      estimatedReadTime: Math.ceil(outline.sections.length * 2),
      suggestedKeywords: keywords
    };
  },

  async getTemplates() {
    return [
      {
        id: 'how-to-guide',
        name: 'How-To Guide',
        description: 'Step-by-step instructional content',
        structure: ['Introduction', 'Prerequisites', 'Step-by-step guide', 'Conclusion'],
        recommended_tone: 'professional',
        recommended_length: 'medium'
      },
      {
        id: 'listicle',
        name: 'Listicle',
        description: 'List-based article format',
        structure: ['Introduction', 'List items with explanations', 'Conclusion'],
        recommended_tone: 'engaging',
        recommended_length: 'medium'
      },
      {
        id: 'opinion-piece',
        name: 'Opinion Piece',
        description: 'Personal perspective or analysis',
        structure: ['Hook', 'Background', 'Main argument', 'Supporting points', 'Conclusion'],
        recommended_tone: 'conversational',
        recommended_length: 'long'
      },
      {
        id: 'news-analysis',
        name: 'News Analysis',
        description: 'Analysis of current events or trends',
        structure: ['Summary', 'Background', 'Analysis', 'Implications', 'Conclusion'],
        recommended_tone: 'analytical',
        recommended_length: 'long'
      },
      {
        id: 'tutorial',
        name: 'Technical Tutorial',
        description: 'In-depth technical guide',
        structure: ['Overview', 'Setup', 'Implementation', 'Examples', 'Best Practices', 'Conclusion'],
        recommended_tone: 'authoritative',
        recommended_length: 'long'
      },
      {
        id: 'case-study',
        name: 'Case Study',
        description: 'Real-world example analysis',
        structure: ['Challenge', 'Solution', 'Implementation', 'Results', 'Lessons Learned'],
        recommended_tone: 'professional',
        recommended_length: 'medium'
      }
    ];
  },

  async getArticleById(id) {
    return articles.get(id) || null;
  },

  async deleteArticle(id) {
    return articles.delete(id);
  },

  async getAllArticles() {
    return Array.from(articles.values());
  },

  async getArticlesByTopic(topic) {
    return Array.from(articles.values()).filter(article => 
      article.topic.toLowerCase().includes(topic.toLowerCase())
    );
  },

  async getArticleStats() {
    const allArticles = Array.from(articles.values());
    
    return {
      total_articles: allArticles.length,
      by_status: {
        generated: allArticles.filter(a => a.status === 'generated').length,
        optimized: allArticles.filter(a => a.auto_optimize).length
      },
      by_tone: config.validTones.reduce((acc, tone) => {
        acc[tone] = allArticles.filter(a => a.tone === tone).length;
        return acc;
      }, {}),
      by_length: Object.keys(config.lengthSpecs).reduce((acc, length) => {
        acc[length] = allArticles.filter(a => a.content_length === length).length;
        return acc;
      }, {}),
      average_processing_time: allArticles.length > 0 
        ? Math.round(allArticles.reduce((sum, a) => sum + a.processing_time_ms, 0) / allArticles.length)
        : 0
    };
  },

  countWords(text) {
    return text.trim().split(/\s+/).length;
  },

  validateTone(tone) {
    return config.validTones.includes(tone);
  },

  validateContentLength(length) {
    return Object.keys(config.lengthSpecs).includes(length);
  }
};

module.exports = articleService;
