import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'; // Backend URL

// Fetch PDF data from the backend
export const fetchPDFs = async (params) => {
  try {
    const response = await axios.post(`${BASE_URL}/fetch-pdfs`, params);
    return response.data; // Backend should return the PDFs and metadata
  } catch (error) {
    console.error('Error fetching PDFs:', error.message);
    throw error;
  }
};

// Process extracted text with WorqHat
export const processExtractedText = async (extractedText, prompt) => {
  try {
    const response = await axios.post(`${BASE_URL}/process-text`, { extractedText, prompt });
    return response.data;
  } catch (error) {
    console.error('Error processing extracted text:', error.message);
    throw error;
  }
};

// Process PDF files with WorqHat
export const processPDFFile = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/process-pdf`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error processing PDF file:', error.message);
    throw error;
  }
};

export const extractPDFs = async (columns) => {
  try {
    const response = await axios.post('/api/extract-pdfs', columns);
    return response.data;
  } catch (error) {
    throw new Error('Failed to extract PDFs: ' + error.message);
  }
};

export const processPDFs = async (pdfData) => {
  try {
    const response = await axios.post('/api/process-pdfs', { pdfs: pdfData });
    return response.data;
  } catch (error) {
    throw new Error('Failed to process PDFs: ' + error.message);
  }
};
