// src/utils/SlugGenerator.js
function SlugGenerator(title) {
    return title.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, '-')    // Replace spaces with hyphens
      .trim();
  }
  
  export default SlugGenerator;
  