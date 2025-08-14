# GitHub Actions Environment Variables Guide

This document outlines all the environment variables and secrets needed for the AI Article Generator GitHub Actions workflows.

## Required GitHub Secrets

### Core Application Secrets

#### OpenAI/OpenRouter Configuration
```
OPENAI_API_KEY=sk-or-v1-your_openrouter_key_here
OPENAI_API_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=openai/gpt-4o-mini
OPENAI_MAX_TOKENS=2500
OPENAI_TEMPERATURE=0.7
```

### Deployment Secrets

#### Docker Hub (for container registry)
```
DOCKER_USERNAME=your_dockerhub_username
DOCKER_PASSWORD=your_dockerhub_password_or_token
```

#### AWS Deployment (for Elastic Beanstalk)
```
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-deployment-bucket
AWS_EB_ENVIRONMENT=ai-article-generator-prod
```

#### Heroku Deployment
```
HEROKU_API_KEY=your_heroku_api_key
HEROKU_APP_NAME=your-heroku-app-name
HEROKU_EMAIL=your_heroku_email@example.com
```

#### Staging Environment
```
STAGING_DEPLOY_KEY=your_staging_ssh_key
STAGING_HOST=staging.yourdomain.com
STAGING_USER=deploy
```

#### Production Environment
```
PRODUCTION_DEPLOY_KEY=your_production_ssh_key
PRODUCTION_HOST=api.yourdomain.com
PRODUCTION_USER=deploy
```

### Monitoring & Notifications

#### Code Coverage (optional)
```
CODECOV_TOKEN=your_codecov_token
```

#### Slack Notifications (optional)
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

## How to Set Up GitHub Secrets

### 1. Navigate to Repository Settings
1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click "Secrets and variables"
4. Click "Actions"

### 2. Add Repository Secrets
Click "New repository secret" and add each secret one by one:

#### Essential Secrets (Minimum Required):
```
Name: OPENAI_API_KEY
Value: sk-or-v1-your_openrouter_key_here

Name: OPENAI_API_BASE_URL  
Value: https://openrouter.ai/api/v1

Name: OPENAI_MODEL
Value: openai/gpt-4o-mini
```

#### For Docker Build:
```
Name: DOCKER_USERNAME
Value: your_dockerhub_username

Name: DOCKER_PASSWORD
Value: your_dockerhub_password
```

#### For AWS Deployment:
```
Name: AWS_ACCESS_KEY_ID
Value: AKIAIOSFODNN7EXAMPLE

Name: AWS_SECRET_ACCESS_KEY
Value: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

Name: AWS_REGION
Value: us-east-1

Name: AWS_S3_BUCKET
Value: your-deployment-bucket

Name: AWS_EB_ENVIRONMENT
Value: ai-article-generator-prod
```

## Environment-Specific Variables

### Development Environment (.env.development)
```bash
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
LOG_TO_FILE=true
```

### Staging Environment (.env.staging)
```bash
NODE_ENV=staging
PORT=3000
CORS_ORIGIN=https://staging.yourdomain.com
LOG_LEVEL=info
LOG_TO_FILE=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Production Environment (.env.production)
```bash
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://api.yourdomain.com
LOG_LEVEL=warn
LOG_TO_FILE=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50
```

## Default Application Variables

These are set automatically in the workflows but can be overridden:

```bash
DEFAULT_CONTENT_LENGTH=medium
DEFAULT_TONE=professional
DEFAULT_SEARCH_DEPTH=10
DEFAULT_RECENCY_HOURS=24
DEFAULT_QUALITY_THRESHOLD=7.0
DEFAULT_AUTO_OPTIMIZE=true
DEFAULT_INCLUDE_ANALYTICS=true
DEFAULT_ARTICLE_COUNT=3
```

## Security Best Practices

### 1. API Key Management
- **Never commit API keys** to the repository
- Use **GitHub Secrets** for all sensitive data
- **Rotate keys regularly** (quarterly recommended)
- Use **least privilege principle** for AWS IAM roles

### 2. Environment Separation
- Use **different API keys** for staging and production
- Implement **rate limiting** in production
- Monitor **API usage** and set alerts

### 3. Secret Rotation
```bash
# Example of updating secrets via GitHub CLI
gh secret set OPENAI_API_KEY --body "new_api_key_value"
gh secret set AWS_ACCESS_KEY_ID --body "new_access_key"
```

## Workflow Triggers

### Automatic Deployment Triggers:
- **Push to `main`** → Production deployment
- **Push to `develop`** → Staging deployment  
- **Pull Request** → Testing only
- **Tagged release** → Production + Docker image

### Manual Deployment:
```bash
# Trigger manual deployment via GitHub CLI
gh workflow run deploy.yml
```

## Monitoring Setup

### Health Checks
The workflows include health checks that verify:
- ✅ API endpoints respond correctly
- ✅ OpenAI API connectivity
- ✅ Environment variables are set
- ✅ Database connectivity (if applicable)

### Failure Notifications
Set up these secrets for notifications:
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

## Troubleshooting

### Common Issues:

#### 1. API Key Issues
```bash
Error: OpenAI API error: 401 - Unauthorized
```
**Solution**: Verify `OPENAI_API_KEY` secret is set correctly

#### 2. Deployment Failures
```bash
Error: Access Denied
```
**Solution**: Check AWS credentials and permissions

#### 3. Docker Build Failures
```bash
Error: authentication required
```
**Solution**: Verify Docker Hub credentials

### Debug Commands:
```bash
# Check if secrets are accessible (in workflow)
- name: Debug secrets
  run: |
    echo "OpenAI API Key: ${{ secrets.OPENAI_API_KEY != '' }}"
    echo "AWS Region: ${{ secrets.AWS_REGION }}"
```

## Getting Started Checklist

- [ ] **Set up OpenRouter account** and get API key
- [ ] **Add OPENAI_API_KEY** to GitHub secrets
- [ ] **Add OPENAI_API_BASE_URL** to GitHub secrets  
- [ ] **Add OPENAI_MODEL** to GitHub secrets
- [ ] **Set up Docker Hub account** (optional)
- [ ] **Add Docker secrets** (optional)
- [ ] **Configure AWS account** (for production deployment)
- [ ] **Add AWS secrets** (for production deployment)
- [ ] **Set up Slack webhook** (for notifications)
- [ ] **Test workflows** with a small change

## Support

For questions about environment setup:
1. Check the [GitHub Actions documentation](https://docs.github.com/en/actions)
2. Review workflow logs in the "Actions" tab
3. Verify all required secrets are set in repository settings

---

**Note**: This guide assumes you're using OpenRouter as your AI provider. If using OpenAI directly, replace the base URL and adjust the model name accordingly.
