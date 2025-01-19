// const axios = require("axios");
// require("dotenv").config();

// /**
//  * Process extracted text using WorqHat API and optionally include a custom prompt.
//  * @param {string} extractedText - The text extracted from a PDF.
//  * @param {string} [prompt=null] - An optional prompt to customize the API response.
//  * @returns {Promise<Object>} - A promise resolving to the API response.
//  */
// async function processExtractedTextWithWorqHat(extractedText, prompt = null) {
//   const apiUrl =
//     process.env.WORQHAT_API_URL2 || "https://api.worqhat.com/api/ai/content/v4";
//   const apiKey = process.env.WORQHAT_API_KEY;

//   if (!apiKey) {
//     throw new Error(
//       "WorqHat API key is not configured in the environment variables."
//     );
//   }

//   // Use the provided prompt or a default training context
//   const trainingData = prompt
//     ? prompt
//     : "You are alex and you are one of the best at everything. give key-value pair for the given output.";

//   const payload = {
//     question: extractedText,
//     model: "aicon-v4-nano-160824",
//     randomness: 0.5,
//     stream_data: false,
//     training_data: trainingData,
//     response_type: "text",
//   };

//   console.log("API URL:", apiUrl);
//   console.log("Request payload:", JSON.stringify(payload, null, 2));

//   try {
//     console.log("Sending request to WorqHat API...");
//     const response = await axios.post(apiUrl, payload, {
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//         "Content-Type": "application/json",
//       },
//     });

//     const responseData = response.data;
//     console.log("API Response:", JSON.stringify(responseData, null, 2));
//     return responseData;
//   } catch (error) {
//     console.error(
//       "Error processing text with WorqHat API:",
//       error.response?.data || error.message
//     );
//     throw new Error(
//       `Error processing text with WorqHat API: ${
//         error.response?.data?.message || error.message
//       }`
//     );
//   }
// }

// module.exports = { processExtractedTextWithWorqHat };


const axios = require("axios");
// const { convertTextToSingleLine } = require('./convertTextToSingleLine'); // Import the function

require("dotenv").config();


/**
 * Process extracted text using WorqHat API and optionally include a custom prompt.
 * @param {string} extractedText - The text extracted from a PDF.
 * @param {string} [prompt=null] - An optional prompt to customize the API response.
 * @returns {Promise<Object>} - A promise resolving to the API response.
 */


async function processExtractedTextWithWorqHat(extractedText, prompt = null) {
  // Ensure extractedText is not undefined or null
  // if (!extractedText || typeof extractedText !== 'string') {
  //   throw new Error('Invalid extracted text provided.');
  // }

  // Proceed with the rest of the code
  const apiUrl =
    process.env.WORQHAT_API_URL2 || "https://api.worqhat.com/api/ai/content/v4";
  const apiKey = process.env.WORQHAT_API_KEY;

  if (!apiKey) {
    throw new Error("WorqHat API key is not configured in the environment variables.");
  }

  // console.log("Extracted Text:", extractedText);
  // Convert the extracted text to a single line
  // const singleLineText = convertTextToSingleLine(extractedText);

  const trainingData = prompt
  ? prompt
  : `Please analyze the following invoice text and extract the relevant information, returning the details in a key-value pair format. The keys should be:
1) Customer Name
2) Invoice Number
3) Supplier Name (or Store Name)
4) Date of Invoice
5) Product Name(s)
6) Taxable Value
7) GST ID
8) Total Amount
9) Quantity

Note:
- The feature names in the invoice text may vary, but you need to map them correctly to the keys above.
- For "Customer Name," it may be referred to as "Bill To," "Customer Name," "Name," or similar terms.
- For "Invoice Number," it might appear as "Invoice No.," "Invoice Number," "Bill No.," or other variations.
- "Supplier Name" can be referred to as "Store Name," "Supplier," "Seller," or "Company."
- The "Date of Invoice" might be formatted in various ways, such as "Date," "Invoice Date," "Transaction Date," etc.
- "Product Name" can appear as "Item Name," "Product," "Description," or "Item."
- "Taxable Value" might be noted as "Total Taxable Value," "Taxable Amount," or similar.
- "GST ID" can appear as "GST Number," "GSTIN," or "GST Identification Number."
- "Total Amount" may be noted as "Total," "Total Amount," "Amount Due," or "Grand Total."
- "Quantity" might be listed as "Quantity," "Qty," or "Units."

Here is the invoice text you need to analyze:

{Insert the invoice text here}

Please return the extracted information in the following key-value format:
{
  "Customer Name": "Extracted Customer Name",
  "Invoice Number": "Extracted Invoice Number",
  "Supplier Name": "Extracted Supplier Name",
  "Date": "Extracted Date",
  "Product Name": "Extracted Product Name(s)",
  "Taxable Value": "Extracted Taxable Value",
  "GST ID": "Extracted GST ID",
  "Total Amount": "Extracted Total Amount",
  "Quantity": "Extracted Quantity"
}`;


  const payload = {
    question: extractedText, 
    model: "aicon-v4-nano-160824",
    randomness: 0.5,
    stream_data: false,
    training_data: trainingData,
    response_type: "text",
  };

  console.log("API URL:", apiUrl);
  console.log("Request payload:", JSON.stringify(payload, null, 2));

  try {
    console.log("Sending request to WorqHat API...");
    const response = await axios.post(apiUrl, payload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    const responseData = response.data;
    console.log("API Response:", JSON.stringify(responseData, null, 2));
    return responseData;
  } catch (error) {
    console.error("Error processing text with WorqHat API:", error.response?.data || error.message);
    throw new Error(`Error processing text with WorqHat API: ${error.response?.data?.message || error.message}`);
  }
}


module.exports = { processExtractedTextWithWorqHat };
