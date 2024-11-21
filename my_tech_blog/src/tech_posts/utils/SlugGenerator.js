// src/utils/SlugGenerator.js
function SlugGenerator(title) {
  return title
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .trim()                  // Remove leading/trailing spaces
      .replace(/\s+/g, '-');   // Replace spaces with hyphens
}

export default SlugGenerator;