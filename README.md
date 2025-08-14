# AI Article Generator

AI-powered automated article generation pipeline built with Express.js.

## 🚀 Features

- **AI-Powered Content Generation**: Generate high-quality articles using OpenAI
- **SEO Optimization**: Built-in SEO metadata generation and optimization
- **Multiple Writing Tones**: Support for professional, casual, analytical, conversational, authoritative, and engaging tones
- **Article Templates**: Pre-built templates for different article types
- **Preview Mode**: Generate article previews before full content creation
- **Rate Limiting**: Built-in API rate limiting for security
- **Comprehensive Testing**: Full test suite with Jest and Supertest
- **Development Tools**: Hot reloading with Nodemon

## 📁 Project Structure

```
ai-article-generator/
├── src/
│   ├── controllers/          # Request handlers
│   │   └── articleController.js
│   ├── routes/              # API route definitions
│   │   ├── index.js
│   │   └── articleRoutes.js
│   ├── services/            # Business logic
│   │   ├── articleService.js
│   │   ├── openaiService.js
│   │   └── seoService.js
│   ├── middleware/          # Custom middleware
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   └── validateRequest.js
│   ├── utils/               # Utility functions
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── asyncHandler.js
│   ├── models/              # Data models
│   │   └── Article.js
│   ├── config/              # Configuration files
│   │   └── config.js
│   └── app.js              # Express app configuration
├── tests/                   # Test files
│   └── api.test.js
├── public/                  # Static files
│   └── index.html
├── logs/                    # Log files
├── server.js               # Application entry point
├── package.json
└── README.md
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-article-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   ```

## 🚀 Usage

### Development
```bash
npm run dev          # Start with hot reloading
```

### Production
```bash
npm start           # Start production server
```

### Testing
```bash
npm test           # Run test suite
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
```

## 📡 API Endpoints

### Health Check
- **GET** `/health` - Check API health status

### Articles
- **POST** `/api/articles/generate` - Generate a new article
- **GET** `/api/articles/templates` - Get available article templates
- **POST** `/api/articles/preview` - Generate article preview
- **GET** `/api/articles/:id` - Get specific article by ID
- **DELETE** `/api/articles/:id` - Delete article by ID

### API Documentation
Visit `http://localhost:3000` for interactive API documentation.

## 📝 Example Usage

### Generate Article
```bash
curl -X POST http://localhost:3000/api/articles/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Machine Learning in Healthcare",
    "keywords": ["AI", "healthcare", "medical"],
    "tone": "professional",
    "wordCount": 1200,
    "seoOptimized": true
  }'
```

### Generate Preview
```bash
curl -X POST http://localhost:3000/api/articles/preview \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Web Development Trends",
    "keywords": ["JavaScript", "React", "Node.js"],
    "tone": "casual"
  }'
```

## 🔧 Configuration

The application uses environment variables for configuration:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `OPENAI_API_KEY` | OpenAI API key | Required |
| `OPENAI_MODEL` | OpenAI model | `gpt-3.5-turbo` |
| `OPENAI_MAX_TOKENS` | Max tokens per request | `2000` |
| `OPENAI_TEMPERATURE` | Model temperature | `0.7` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

## 🔄 CI/CD & Deployment

### GitHub Actions Workflows

This project includes comprehensive GitHub Actions workflows for automated testing, building, and deployment:

#### 🧪 Continuous Integration (`ci.yml`)
- **Multi-Node Testing**: Tests on Node.js 18.x, 20.x, 22.x
- **Automated Linting**: ESLint code quality checks
- **Security Scanning**: Vulnerability audits and dependency checks
- **Code Coverage**: Automated coverage reporting with Codecov
- **Build Verification**: Ensures application builds successfully

#### 🐳 Docker Pipeline (`docker.yml`)
- **Multi-Platform Builds**: AMD64 and ARM64 architectures
- **Container Registry**: Pushes to GitHub Container Registry and Docker Hub
- **Tag Management**: Semantic versioning and SHA-based tags
- **Build Caching**: Optimized build times with GitHub Actions cache

#### 🚀 Deployment Pipeline (`deploy.yml`)
- **AWS Elastic Beanstalk**: Production deployment to AWS
- **Heroku Deployment**: Alternative cloud deployment option
- **Environment Management**: Staging and production environments
- **Health Checks**: Post-deployment verification

### Required GitHub Secrets

To enable all workflows, add these secrets to your repository:

#### Core Application
```
OPENAI_API_KEY           # Your OpenRouter/OpenAI API key
OPENAI_API_BASE_URL      # API endpoint (https://openrouter.ai/api/v1)
OPENAI_MODEL             # Model name (openai/gpt-4o-mini)
```

#### Docker Hub (Optional)
```
DOCKER_USERNAME          # Docker Hub username
DOCKER_PASSWORD          # Docker Hub password/token
```

#### AWS Deployment (Optional)
```
AWS_ACCESS_KEY_ID        # AWS access key
AWS_SECRET_ACCESS_KEY    # AWS secret key
AWS_REGION              # AWS region (e.g., us-east-1)
AWS_S3_BUCKET           # S3 bucket for deployments
AWS_EB_ENVIRONMENT      # Elastic Beanstalk environment name
```

#### Heroku Deployment (Optional)
```
HEROKU_API_KEY          # Heroku API key
HEROKU_APP_NAME         # Heroku application name
HEROKU_EMAIL            # Heroku account email
```

#### Notifications (Optional)
```
SLACK_WEBHOOK_URL       # Slack webhook for deployment notifications
CODECOV_TOKEN           # Codecov token for coverage reporting
```

### Setting Up GitHub Secrets

1. Go to your repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add each required secret

For detailed setup instructions, see [`.github/ENVIRONMENT_VARIABLES.md`](.github/ENVIRONMENT_VARIABLES.md)

### Local Docker Development

```bash
# Build Docker image
npm run docker:build

# Run with Docker
npm run docker:run

# Run with Docker Compose
npm run docker:compose
```

### Deployment Environments

#### Staging
- **Trigger**: Push to `develop` branch
- **URL**: `https://staging.yourdomain.com`
- **Purpose**: Testing before production

#### Production  
- **Trigger**: Push to `main` branch
- **URL**: `https://api.yourdomain.com`
- **Purpose**: Live production environment

### Monitoring & Health Checks

All deployments include:
- ✅ **Health Endpoints**: `/api/v1/health`
- ✅ **Uptime Monitoring**: Automated health checks
- ✅ **Error Tracking**: Application monitoring
- ✅ **Performance Metrics**: Response time tracking

## 🧪 Testing

### Run Test Suite

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test tests/services/openai.test.js

# Run tests in watch mode
npm run test:watch
```

### Manual Testing

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Test article generation
curl -X POST http://localhost:3000/api/articles/v1/generate-advanced \
  -H "Content-Type: application/json" \
  -d '{"topic": "AI Technology Trends"}'

# Check generation statistics
curl http://localhost:3000/api/articles/v1/stats
```

## 🚀 CI/CD & GitHub Actions

This project includes comprehensive GitHub Actions workflows for automated testing, building, and deployment.

### Quick Setup

1. **Add Required Secrets** to your GitHub repository (`Settings > Secrets and variables > Actions`):
   ```
   OPENAI_API_KEY=your-api-key
   OPENAI_API_BASE_URL=https://openrouter.ai/api/v1
   OPENAI_MODEL=openai/gpt-oss-20b:free
   ```

2. **Optional Secrets** for enhanced features:
   ```
   DOCKER_USERNAME=your_dockerhub_username
   DOCKER_PASSWORD=your_dockerhub_password
   CODECOV_TOKEN=your_codecov_token
   SLACK_WEBHOOK_URL=your_slack_webhook
   ```

### Workflows Included

- **🔄 CI Pipeline** (`ci.yml`): Automated testing on multiple Node.js versions, linting, security scans
- **🐳 Docker Build** (`docker.yml`): Multi-platform Docker image builds and registry push
- **🚀 Deployment** (`deploy.yml`): Automated staging/production deployments with approval gates

### Supported Deployment Targets

- **Docker**: GitHub Container Registry (ghcr.io)
- **Heroku**: Direct deployment with API key
- **AWS**: S3 + Elastic Beanstalk
- **SSH**: Custom server deployment via SSH
- **Manual**: Workflow dispatch for on-demand deployments

📖 **[Complete CI/CD Documentation](docs/github-actions.md)**

The project includes comprehensive tests:

- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **Validation Tests**: Input validation testing

Run tests with:
```bash
npm test
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting
- **Input Validation**: Request validation with express-validator
- **Error Handling**: Comprehensive error handling

## 🚦 API Response Format

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "data": { ... },
  "message": "Success",
  "timestamp": "2025-08-14T15:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication and authorization
- [ ] Third-party publishing API integrations
- [x] GitHub Actions CI/CD pipeline
- [x] Docker containerization
- [x] AWS/Heroku deployment workflows
- [x] Automated testing and security scanning
- [ ] Image generation for articles
- [ ] Advanced SEO analysis
- [ ] Article scheduling
- [ ] Analytics dashboard
- [ ] Content templates management
- [ ] Multi-language support
Article Generator powered by AI and Node js. this is only api
