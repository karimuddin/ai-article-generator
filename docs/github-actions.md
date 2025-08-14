# GitHub Actions & CI/CD Setup for AI Article Generator

This document outlines the GitHub Actions workflows and environment variables needed for the AI Article Generator CI/CD pipeline.

## 🔧 Required GitHub Secrets

Add these secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

### Core API Configuration
```
OPENAI_API_KEY=your-openai-or-openrouter-api-key
OPENAI_API_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=openai/gpt-oss-20b:free
OPENAI_MAX_TOKENS=2500
OPENAI_TEMPERATURE=0.7
```

### Docker Registry (Optional)
```
DOCKER_USERNAME=your_dockerhub_username
DOCKER_PASSWORD=your_dockerhub_password
```

### Code Coverage (Optional)
```
CODECOV_TOKEN=your_codecov_token
```

### Security Scanning (Optional)
```
SNYK_TOKEN=your_snyk_token
```

### Deployment (Optional)
```
STAGING_DEPLOY_KEY=your_staging_ssh_private_key
STAGING_HOST=staging.yourdomain.com
STAGING_USER=deploy

PRODUCTION_DEPLOY_KEY=your_production_ssh_private_key
PRODUCTION_HOST=api.yourdomain.com
PRODUCTION_USER=deploy
```

### Notifications (Optional)
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

## 🚀 Workflows Overview

### 1. CI Pipeline (`.github/workflows/ci.yml`)
- **Triggers**: Push to `main`/`develop`, Pull Requests to `main`
- **Jobs**:
  - **Test**: Runs on Node.js 18.x, 20.x, 22.x matrix
  - **Build**: Creates deployment artifacts
  - **Security Scan**: npm audit & vulnerability checks
  - **Deploy Staging**: Auto-deploy `develop` branch
  - **Deploy Production**: Auto-deploy `main` branch
  - **Docker Build**: Build and push Docker images
  - **Notify**: Slack notifications

### 2. Docker Workflow (`.github/workflows/docker.yml`)
- **Triggers**: Push to `main`, version tags
- **Purpose**: Build multi-platform Docker images
- **Registry**: GitHub Container Registry (ghcr.io)

### 3. Deploy Workflow (`.github/workflows/deploy.yml`)
- **Triggers**: Manual workflow dispatch
- **Purpose**: Manual production deployments
- **Features**: Environment selection, approval gates

## 📋 Environment Variables in Workflows

All workflows use these environment variables:

```yaml
env:
  NODE_ENV: test
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  OPENAI_API_BASE_URL: ${{ secrets.OPENAI_API_BASE_URL }}
  OPENAI_MODEL: ${{ secrets.OPENAI_MODEL }}
  OPENAI_MAX_TOKENS: ${{ secrets.OPENAI_MAX_TOKENS }}
  OPENAI_TEMPERATURE: ${{ secrets.OPENAI_TEMPERATURE }}
  PORT: 3001
  CORS_ORIGIN: "*"
  RATE_LIMIT_WINDOW_MS: 900000
  RATE_LIMIT_MAX_REQUESTS: 100
  LOG_LEVEL: info
  LOG_TO_FILE: false
  DEFAULT_CONTENT_LENGTH: medium
  DEFAULT_TONE: professional
  DEFAULT_SEARCH_DEPTH: 10
  DEFAULT_RECENCY_HOURS: 24
  DEFAULT_QUALITY_THRESHOLD: 7.0
  DEFAULT_AUTO_OPTIMIZE: true
  DEFAULT_INCLUDE_ANALYTICS: true
  DEFAULT_ARTICLE_COUNT: 3
```

## 🔐 Security Features

- **npm audit**: Checks for known vulnerabilities
- **Dependency scanning**: Using audit-ci
- **Code coverage**: Track test coverage with Codecov
- **Secret scanning**: GitHub automatically scans for leaked secrets
- **SAST scanning**: Can integrate Snyk or CodeQL

## 📦 Deployment Options

The workflows support multiple deployment strategies:

### 1. Docker Deployment
```bash
# Manual Docker deployment
docker pull ghcr.io/yourusername/ai-article-generator:latest
docker run -p 3000:3000 --env-file .env ghcr.io/yourusername/ai-article-generator:latest
```

### 2. SSH Deployment
```yaml
- name: Deploy via SSH
  run: |
    echo "${{ secrets.DEPLOY_KEY }}" > deploy_key
    chmod 600 deploy_key
    scp -i deploy_key deployment.tar.gz ${{ secrets.DEPLOY_USER }}@${{ secrets.DEPLOY_HOST }}:/tmp/
    ssh -i deploy_key ${{ secrets.DEPLOY_USER }}@${{ secrets.DEPLOY_HOST }} '
      cd /opt/ai-article-generator
      tar -xzf /tmp/deployment.tar.gz
      npm install --production
      pm2 restart ai-article-generator
    '
```

### 3. Heroku Deployment
```yaml
- name: Deploy to Heroku
  uses: akhileshns/heroku-deploy@v3.12.12
  with:
    heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
    heroku_app_name: ${{ secrets.HEROKU_APP_NAME }}
    heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

### 4. AWS Deployment
```yaml
- name: Deploy to AWS
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    AWS_REGION: ${{ secrets.AWS_REGION }}
  run: |
    aws s3 cp deployment.zip s3://${{ secrets.AWS_S3_BUCKET }}/
    aws elasticbeanstalk create-application-version \
      --application-name ai-article-generator \
      --version-label ${{ github.sha }} \
      --source-bundle S3Bucket=${{ secrets.AWS_S3_BUCKET }},S3Key=deployment.zip
```

## 🔄 Workflow Triggers

### Automatic Triggers
- **Push to `main`**: Production deployment
- **Push to `develop`**: Staging deployment  
- **Pull Request to `main`**: Run tests only
- **Version tags**: Create releases

### Manual Triggers
- **workflow_dispatch**: Manual deployment with environment selection
- **repository_dispatch**: External webhook triggers

## 📊 Monitoring & Notifications

### Slack Integration
Configure Slack notifications for:
- ✅ Successful deployments
- ❌ Failed builds/deployments
- 🔄 Deployment started/completed
- 📊 Test coverage reports

### Status Checks
All workflows create status checks that are required for:
- Pull request merging
- Branch protection rules
- Deployment approvals

## 🚨 Troubleshooting

### Common Issues

1. **API Key Errors**
   - Ensure `OPENAI_API_KEY` is set in GitHub Secrets
   - Verify the key format (OpenRouter: `sk-or-v1-...`)

2. **Test Failures**
   - Check environment variables are properly set
   - Verify OpenAI API quotas and limits

3. **Docker Build Failures**
   - Check Dockerfile syntax
   - Ensure all dependencies are in package.json

4. **Deployment Failures**
   - Verify SSH keys and host access
   - Check deployment scripts and permissions

### Debug Mode
Enable debug logging by setting:
```yaml
env:
  LOG_LEVEL: debug
  NODE_ENV: development
```

## 📈 Performance Optimization

### Caching Strategy
- **npm dependencies**: Cached between runs
- **Docker layers**: Multi-stage builds with layer caching
- **Test results**: Cached for faster feedback

### Parallel Execution
- **Matrix builds**: Test on multiple Node.js versions
- **Parallel jobs**: Independent test/build/security jobs
- **Concurrent deployments**: Staging and production in parallel

## 🔧 Customization

### Adding New Environments
1. Create environment in GitHub (`Settings > Environments`)
2. Add environment-specific secrets
3. Update workflow with new job:

```yaml
deploy-custom:
  runs-on: ubuntu-latest
  needs: [test, build]
  environment: custom-env
  steps:
    - name: Deploy to Custom Environment
      run: echo "Custom deployment logic"
```

### Custom Notifications
Add new notification channels:

```yaml
- name: Discord Notification
  uses: Ilshidur/action-discord@master
  with:
    args: 'Deployment completed: ${{ job.status }}'
  env:
    DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK }}
```

This setup provides a robust, scalable CI/CD pipeline for the AI Article Generator with comprehensive testing, security scanning, and flexible deployment options.
