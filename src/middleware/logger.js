const config = require('../config/config');

const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';

  // Log the request
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  
  if (config.logging.level === 'debug') {
    console.log(`User-Agent: ${userAgent}`);
    if (Object.keys(req.body).length > 0) {
      console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }
  }

  // Track response time
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const statusColor = statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'; // Red for errors, green for success
    const resetColor = '\x1b[0m';
    
    console.log(`[${timestamp}] ${method} ${url} - ${statusColor}${statusCode}${resetColor} - ${duration}ms`);
    
    // Log to file if configured
    if (config.logging.logToFile) {
      // In production, implement file logging here
      // For now, we'll just use console.log
    }
  });

  next();
};

module.exports = logger;
