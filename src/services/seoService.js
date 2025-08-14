const seoService = {
  async generateSEOMetadata(topic, content, keywords) {
    const metaDescription = this.generateMetaDescription(topic, content);
    const seoKeywords = this.extractSEOKeywords(content, keywords);
    const slugSuggestion = this.generateSlug(topic);
    
    return {
      metaDescription,
      keywords: seoKeywords,
      slug: slugSuggestion,
      readingTime: this.calculateReadingTime(content),
      seoScore: this.calculateSEOScore(content, keywords)
    };
  },

  generateMetaDescription(topic, content) {
    // Extract first meaningful paragraph for meta description
    const sentences = content.split('.').filter(s => s.trim().length > 20);
    let description = sentences.slice(0, 2).join('.').trim();
    
    if (description.length > 160) {
      description = description.substring(0, 157) + '...';
    }
    
    return description;
  },

  extractSEOKeywords(content, providedKeywords) {
    // Simple keyword extraction (in production, use more sophisticated NLP)
    const words = content.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const wordFreq = {};
    
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    // Get most frequent words
    const frequentWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
    
    // Combine with provided keywords
    const allKeywords = [...new Set([...providedKeywords, ...frequentWords])];
    
    return allKeywords.slice(0, 15); // Limit to 15 keywords
  },

  generateSlug(topic) {
    return topic
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  },

  calculateReadingTime(content) {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    
    return {
      minutes,
      text: `${minutes} min read`
    };
  },

  calculateSEOScore(content, keywords) {
    let score = 0;
    const contentLower = content.toLowerCase();
    
    // Check if keywords appear in content
    keywords.forEach(keyword => {
      if (contentLower.includes(keyword.toLowerCase())) {
        score += 10;
      }
    });
    
    // Check content length (ideal: 1000-2000 words)
    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount >= 1000 && wordCount <= 2000) {
      score += 20;
    } else if (wordCount >= 500) {
      score += 10;
    }
    
    // Check for headings
    const headingCount = (content.match(/^#+\s/gm) || []).length;
    score += Math.min(headingCount * 5, 20);
    
    // Check for lists
    const listCount = (content.match(/^[\-\*\+]\s/gm) || []).length;
    score += Math.min(listCount * 2, 10);
    
    return Math.min(score, 100); // Cap at 100
  }
};

module.exports = seoService;
