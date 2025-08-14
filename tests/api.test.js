const request = require('supertest');
const app = require('../src/app');

describe('AI Article Generator API', () => {
  // Health check tests
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api/articles/v1/health', () => {
    it('should return enhanced health status', async () => {
      const response = await request(app)
        .get('/api/articles/v1/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status', 'healthy');
      expect(response.body.data).toHaveProperty('api_key_configured');
      expect(response.body.data).toHaveProperty('api_version');
    });
  });

  // API Information tests
  describe('GET /api', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body).toHaveProperty('name', 'AI Article Generator API');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body).toHaveProperty('features');
    });
  });

  describe('GET /api/articles/v1/config', () => {
    it('should return API configuration', async () => {
      const response = await request(app)
        .get('/api/articles/v1/config')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('endpoints');
      expect(response.body.data).toHaveProperty('valid_tones');
      expect(response.body.data).toHaveProperty('valid_lengths');
      expect(response.body.data).toHaveProperty('limits');
    });
  });

  // Advanced Article Generation tests
  describe('POST /api/articles/v1/generate-advanced', () => {
    it('should generate advanced article with valid input', async () => {
      const articleData = {
        topic: 'Artificial Intelligence in Modern Healthcare',
        article_count: 2,
        content_length: 'medium',
        tone: 'professional',
        search_depth: 10,
        recency_hours: 24,
        quality_threshold: 7.5,
        seo_keywords: 'AI, healthcare, medical technology',
        auto_optimize: true,
        include_analytics: true
      };

      const response = await request(app)
        .post('/api/articles/v1/generate-advanced')
        .send(articleData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('article');
      expect(response.body.data).toHaveProperty('trending_topics_analyzed');
      expect(response.body.data).toHaveProperty('candidates_generated');
      expect(response.body.data).toHaveProperty('processing_time_ms');
    });

    it('should return validation error for missing topic', async () => {
      const response = await request(app)
        .post('/api/articles/v1/generate-advanced')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should return validation error for invalid content_length', async () => {
      const response = await request(app)
        .post('/api/articles/v1/generate-advanced')
        .send({
          topic: 'Test Topic',
          content_length: 'invalid_length'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return validation error for invalid tone', async () => {
      const response = await request(app)
        .post('/api/articles/v1/generate-advanced')
        .send({
          topic: 'Test Topic',
          tone: 'invalid_tone'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  // Batch Generation tests
  describe('POST /api/articles/v1/generate-batch', () => {
    it('should generate batch articles with valid input', async () => {
      const batchData = {
        topics: ['AI in Education', 'Future of Work'],
        content_length: 'short',
        tone: 'engaging',
        auto_optimize: true
      };

      const response = await request(app)
        .post('/api/articles/v1/generate-batch')
        .send(batchData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('batch_results');
      expect(response.body.data).toHaveProperty('total_topics', 2);
      expect(response.body.data).toHaveProperty('successful_generations');
    });

    it('should return validation error for empty topics array', async () => {
      const response = await request(app)
        .post('/api/articles/v1/generate-batch')
        .send({ topics: [] })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return validation error for too many topics', async () => {
      const response = await request(app)
        .post('/api/articles/v1/generate-batch')
        .send({ 
          topics: ['Topic1', 'Topic2', 'Topic3', 'Topic4', 'Topic5', 'Topic6'] 
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  // Legacy API tests (backward compatibility)
  describe('POST /api/articles/generate', () => {
    it('should generate legacy article with valid input', async () => {
      const articleData = {
        topic: 'Machine Learning',
        keywords: ['AI', 'ML', 'algorithms'],
        tone: 'professional',
        wordCount: 800,
        seoOptimized: true
      };

      const response = await request(app)
        .post('/api/articles/generate')
        .send(articleData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('title');
      expect(response.body.data).toHaveProperty('content');
      expect(response.body.data.topic).toBe(articleData.topic);
    });
  });

  // Templates tests
  describe('GET /api/articles/templates', () => {
    it('should return enhanced article templates', async () => {
      const response = await request(app)
        .get('/api/articles/templates')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // Check for enhanced template properties
      const firstTemplate = response.body.data[0];
      expect(firstTemplate).toHaveProperty('recommended_tone');
      expect(firstTemplate).toHaveProperty('recommended_length');
    });
  });

  // Preview tests
  describe('POST /api/articles/preview', () => {
    it('should generate article preview', async () => {
      const previewData = {
        topic: 'Web Development',
        keywords: ['JavaScript', 'React'],
        tone: 'casual'
      };

      const response = await request(app)
        .post('/api/articles/preview')
        .send(previewData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('title');
      expect(response.body.data).toHaveProperty('outline');
    });
  });

  // Article management tests
  describe('Article Management', () => {
    let articleId;

    beforeAll(async () => {
      // Generate an article for testing
      const response = await request(app)
        .post('/api/articles/generate')
        .send({
          topic: 'Test Article for Management',
          tone: 'professional'
        });
      
      articleId = response.body.data.id;
    });

    describe('GET /api/articles/v1/articles', () => {
      it('should get all articles with pagination', async () => {
        const response = await request(app)
          .get('/api/articles/v1/articles?limit=5&offset=0')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('articles');
        expect(response.body.data).toHaveProperty('pagination');
      });
    });

    describe('GET /api/articles/v1/articles/search', () => {
      it('should search articles by topic', async () => {
        const response = await request(app)
          .get('/api/articles/v1/articles/search?topic=Test')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });

      it('should return error for missing search topic', async () => {
        const response = await request(app)
          .get('/api/articles/v1/articles/search')
          .expect(400);

        expect(response.body.success).toBe(false);
      });
    });

    describe('GET /api/articles/v1/articles/stats', () => {
      it('should return article statistics', async () => {
        const response = await request(app)
          .get('/api/articles/v1/articles/stats')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('total_articles');
        expect(response.body.data).toHaveProperty('by_status');
        expect(response.body.data).toHaveProperty('by_tone');
        expect(response.body.data).toHaveProperty('by_length');
      });
    });

    describe('GET /api/articles/:id', () => {
      it('should get article by ID', async () => {
        const response = await request(app)
          .get(`/api/articles/${articleId}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id', articleId);
      });

      it('should return 404 for non-existent article', async () => {
        const response = await request(app)
          .get('/api/articles/550e8400-e29b-41d4-a716-446655440000')
          .expect(404);

        expect(response.body.success).toBe(false);
      });
    });
  });

  // Configuration tests
  describe('POST /api/articles/v1/configure', () => {
    it('should configure API key', async () => {
      const response = await request(app)
        .post('/api/articles/v1/configure')
        .send({ openai_api_key: 'test-api-key-for-testing-purposes-only' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('api_key_configured', true);
    });

    it('should return validation error for missing API key', async () => {
      const response = await request(app)
        .post('/api/articles/v1/configure')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
