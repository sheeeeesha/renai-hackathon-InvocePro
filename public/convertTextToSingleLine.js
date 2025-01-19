/**
 * Converts multi-line text into a single line by replacing newlines with spaces.
 * @param {string} extractedText - The multi-line extracted text.
 * @returns {string} - The single-line formatted text.
 */
function convertTextToSingleLine(extractedText) {
    return extractedText.replace(/\n/g, ' ');
  }
  
  module.exports = { convertTextToSingleLine };
  