const XLSX = require('xlsx');

/**
 * Extracts key-value pairs from raw PDF text using regex or string matching.
 * @param {string} extractedText - Raw text extracted from the PDF.
 * @returns {Object} - Key-value pairs for the given PDF.
 */
function extractKeyValuePairs(extractedText) {
  const keyValuePairs = {};

  keyValuePairs.gstNumber = extractedText.match(/GSTIN:\s*(\w+)/)?.[1] || 'N/A';
  keyValuePairs.billTo = extractedText.match(/Bill To\s*([\w\s,]+)/)?.[1]?.trim() || 'N/A';
  keyValuePairs.grossAmount = extractedText.match(/Gross Amt\.\s*\(incl\.Tax\):?\s*([\d,.]+)/)?.[1] || 'N/A';
  keyValuePairs.totalValue = extractedText.match(/Total Value\s*([\d,.]+)/)?.[1] || 'N/A';
  keyValuePairs.invoiceDate = extractedText.match(/Date[:\s]*([\w\s,-]+)/)?.[1]?.trim() || 'N/A';
  keyValuePairs.paymentTerms = extractedText.match(/Payment Terms[:\s]*([\w\s]+)/)?.[1]?.trim() || 'N/A';
  keyValuePairs.deliveryTerms = extractedText.match(/Delivery Terms[:\s]*([\w\s]+)/)?.[1]?.trim() || 'N/A';
  keyValuePairs.hsnCode = extractedText.match(/HSN Code[:\s]*([\d]+)/)?.[1] || 'N/A';
  keyValuePairs.quantity = extractedText.match(/Qty[:\s]*([\d,.]+)/)?.[1] || 'N/A';

  return keyValuePairs;
}

/**
 * Parses extracted text from multiple PDFs into structured key-value pairs.
 * @param {Array<string>} pdfTexts - Array of raw text extracted from each PDF.
 * @returns {Array<Object>} - Array of key-value pair objects for each PDF.
 */
function parseMultiplePdfs(pdfTexts) {
  return pdfTexts.map((text, index) => {
    try {
      return { pdfId: `PDF_${index + 1}`, ...extractKeyValuePairs(text) };
    } catch (err) {
      console.error(`Error processing PDF ${index + 1}: ${err.message}`);
      return { pdfId: `PDF_${index + 1}`, error: 'Failed to process' };
    }
  });
}

/**
 * Creates an Excel file from parsed key-value pairs.
 * @param {Array<Object>} structuredData - Parsed key-value pairs for multiple PDFs.
 */
function createExcelFromKeyValuePairs(structuredData) {
  try {
    const ws = XLSX.utils.json_to_sheet(structuredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invoices');

    const filePath = 'client_invoices.xlsx';
    XLSX.writeFile(wb, filePath);

    console.log(`Excel file created successfully at: ${filePath}`);
  } catch (err) {
    console.error('Error creating Excel:', err.message);
    throw err;
  }
}

module.exports = { parseMultiplePdfs, createExcelFromKeyValuePairs };
 