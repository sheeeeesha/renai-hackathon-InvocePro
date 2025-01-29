"use client";

import React, { useState } from "react";
import PDFComponent from "../../components/PdfComp";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ColumnForm from "../../components/ColumnForm";
import path from "path";
import { CSVLink } from "react-csv"; // Import CSVLink for CSV export

const Page = () => {
  const [columns, setColumns] = useState({
    gmail: "",
    startDate: "",
    endDate: "",
    keyword: "",
  });

  const [pdfData, setPdfData] = useState([]); // Holds the PDF data
  const [showPDFs, setShowPDFs] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]); // Holds the table data

  const handleColumnChange = (e) => {
    const { name, value } = e.target;
    setColumns((prevColumns) => ({ ...prevColumns, [name]: value }));
  };

  // Function to call the fetch-emails API and set the pdf data
  const handleGeneratePDFs = async () => {
    try {
      const queryString = new URLSearchParams({
        gmailAddress: columns.gmail,
        startDate: columns.startDate,
        endDate: columns.endDate,
        keyword: columns.keyword,
      }).toString();

      // API request to fetch emails
      const response = await fetch(
        `http://localhost:5000/fetch-emails?${queryString}`,
        {
          method: "GET",
        }
      );

      console.log("API response:", response); // Log the API response

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched PDF data:", data); // Log the fetched data

        if (Array.isArray(data.savedFiles)) {
          setPdfData(
            data.savedFiles.map((pdf) => ({
              filename: pdf,
              fileUrl: `/downloads/${path.basename(pdf)}`, // Extract the filename from the full path
            }))
          );
          setShowPDFs(true);
          setShowTable(false); // Hide the table by default
        } else {
          setPdfData([]);
          setShowPDFs(true);
          setShowTable(false); // Hide the table by default
        }
      } else {
        console.error("Failed to fetch emails");
        alert("Failed to fetch data. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
      setPdfData([]);
    }
  };

  const handleGenerateTable = async () => {
    console.log("handleGenerateTable invoked");
  
    try {
      console.log("Fetching data from the backend...");
      const response = await fetch("http://localhost:5000/start-process", {
        method: "GET", // Adjust this if your backend expects a POST
      });
  
      if (response.ok) {
        console.log("Backend responded successfully.");
        const responseData = await response.json();
        console.log("Response data from backend:", responseData);
  
        // Log the full response to check its structure
        console.log("Full Backend Response:", responseData);
  
        // Check if the response contains the 'data' field and process each entry
        if (responseData.success && responseData.data && Array.isArray(responseData.data)) {
          console.log("Processing extracted data...");
  
          // Process each entry in the 'data' field, especially 'table.content'
          // const processedDataPromises = responseData.data.map(async (item) => {
          //   if (item.table && item.table.content) {
          //     try {
          //       // Step 1: Clean the string by removing backticks and newline characters
          //       let cleanedContent = item.table.content.replace(/^```json\n/, '').replace(/```\n$/, '').trim();
  
          //       // Step 2: Parse the cleaned content to JSON
          //       const parsedContent = JSON.parse(cleanedContent);
          //       console.log("Parsed Content:", parsedContent);
          //       return parsedContent;
          //     } catch (error) {
          //       console.error("Error parsing content:", error);
          //       // Handle cases where the content is not valid JSON
          //       return {};
          //     }
          //   } else {
          //     console.error("No valid content found in table:", item);
          //     return {};
          //   }
          // });

          const processedDataPromises = responseData.data.map(async (item) => {
            if (item.table && item.table.content) {
              try {
                // Step 1: Clean the string by removing backticks and newline characters
                let cleanedContent = item.table.content
                  .replace(/^```json\s*/, '') // Remove the opening ```json
                  .replace(/\s*```$/, '')    // Remove the closing ```
                  .trim();
  
                console.log("Cleaned Content:", cleanedContent);
  
                // Step 2: Parse the cleaned content to JSON
                const parsedContent = JSON.parse(cleanedContent);
                console.log("Parsed Content:", parsedContent);
                return parsedContent;
              } catch (error) {
                console.error("Error parsing JSON content:", error, "Content:", item.table.content);
                // Handle cases where the content is not valid JSON
                return {};
              }
            } else {
              console.error("No valid content found in table:", item);
              return {};
            }
          });
          
  
          const processedData = await Promise.all(processedDataPromises);
          console.log("Processed Data:", processedData);
  
          // Map processed data to the table format
          const mappedTableData = processedData.map((entry) => ({
            customerName: entry["Customer Name"] || "N/A",
            invoiceNumber: entry["Invoice Number"] || "N/A",
            supplierName: entry["Supplier Name"] || "N/A",
            date: entry["Date"] || "N/A",
            productName: Array.isArray(entry["Product Name"]) ? entry["Product Name"].join(", ") : entry["Product Name"] || "N/A",
            taxableValue: entry["Taxable Value"] || "N/A",
            gstId: entry["GST ID"] || "N/A",
            totalAmount: entry["Total Amount"] || "N/A",
            quantity: Array.isArray(entry["Quantity"]) ? entry["Quantity"].join(", ") : entry["Quantity"] || "N/A",
          }));
  
          // Set the table data state with the processed and mapped data
          setTableData(mappedTableData);
  
          setShowTable(true); // Show the table
          console.log("Table data set successfully.");
        } else {
          console.error("Invalid response format or no valid data:", responseData);
          alert("Failed to process data. Please check the console for details.");
        }
      } else {
        console.error("Failed to fetch data from backend. Status:", response.status);
        alert("Failed to fetch data from backend. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleGenerateTable:", error);
      alert("An error occurred while generating the table. Please check the console for details.");
    }
  };
  

  const handleBackToStart = () => {
    setShowPDFs(false);
    setShowTable(false);
    setColumns({ gmail: "", startDate: "", endDate: "", keyword: "" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-auth-bg bg-cover bg-center">
      <Header />

      <div className="flex-1 flex flex-col items-center px-4 py-8">
      <main className="flex-col items-center w-full lg:w-3/5 p-16 bg-white rounded-xl shadow-xl">
  {/* Show the form if PDFs and table are not displayed */}
  {!showPDFs && !showTable && (
    <>
      <p className="flex items-center text-gray-700 font-exo font-semibold text-center mb-6 text-lg">
        InvoicePro is your ultimate invoice hack. Using AI, it scans PDFs, extracts key details like customer names, invoice numbers, and amounts, and organizes everything for you. Whether for a side hustle or big business, it’s fast, accurate, and easy to use—making invoicing effortless.
      </p>
      <h2 className="text-3xl font-extrabold font-lexend text-center text-black mb-6">
        Enter Details
      </h2>

      <ColumnForm
        columns={columns}
        handleColumnChange={handleColumnChange}
      />
      
      {/* Center the button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={handleGeneratePDFs} // Trigger the API call here
          className="px-6 py-3 text-white font-lexend rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700"
        >
          Generate PDFs
        </button>
      </div>
    </>
          )}

          {/* Show the generated PDFs and the button to generate the table */}
          {showPDFs && pdfData.length > 0 && (
            <>
            <h2 className="text-3xl font-extrabold text-center text-black font-lexend mb-6">
              Generated PDFs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pdfData.map((pdf, index) => (
                <div key={index} className="flex flex-col items-center">
                  <PDFComponent
                    filename={pdf.filename} // Pass the filename as a prop to PDFComponent
                    fileUrl={pdf.fileUrl} // Pass the fileUrl as a prop to PDFComponent
                  />
                </div>
              ))}
            </div>
        
            {/* Buttons for Generate Table and Back to Start */}
            <div className="mt-8 flex flex-col items-center gap-4">
              {!showTable && (
                <button
                  onClick={handleGenerateTable} // Trigger the backend process and show the table
                  className="px-6 py-3 text-white font-lexend rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700"
                >
                  Generate Table
                </button>
              )}
              <button
                onClick={handleBackToStart}
                className="px-6 py-3 text-white font-lexend rounded-lg bg-yellow-600 hover:bg-yellow-700 shadow-md transition duration-300"
              >
                Back to Start
              </button>
            </div>
          </>
          )}

          {/* Show the table when showTable is true */}
          {showTable && tableData.length > 0 && (
            <div className="mt-8 text-center">
              <h3 className="text-xl text-black font-lexend font-semibold mb-4">Generated Table</h3>
              <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full table-auto font-oxo">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold font-oxo text-red-600">
                        Customer Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold font-oxo text-red-600">
                        Invoice Number
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold font-oxo text-red-600">
                        Supplier Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold font-oxo text-red-600">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold font-oxo text-red-600">
                        Product Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold font-oxo text-red-600">
                        Taxable Value
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold font-oxo text-red-600">
                        GST ID
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold font-oxo text-red-600">
                        Total Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold font-oxo text-red-600">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={index}>
                        <td className="px-6 py-3 text-sm text-black">
                          {row.customerName}
                        </td>
                        <td className="px-6 py-3 text-sm text-black">
                          {row.invoiceNumber}
                        </td>
                        <td className="px-6 py-3 text-sm text-black">
                          {row.supplierName}
                        </td>
                        <td className="px-6 py-3 text-sm text-black">
                          {row.date}
                        </td>
                        <td className="px-6 py-3 text-sm text-black">
                          {row.productName}
                        </td>
                        <td className="px-6 py-3 text-sm text-black">
                          {row.taxableValue}
                        </td>
                        <td className="px-6 py-3 text-sm text-black">
                          {row.gstId}
                        </td>
                        <td className="px-6 py-3 text-sm text-black">
                          {row.totalAmount}
                        </td>
                        <td className="px-6 py-3 text-sm text-black">
                          {row.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CSV Export Button */}
              <div className="mt-6 text-center">
                <CSVLink
                  data={tableData}
                  headers={[
                    { label: "Customer Name", key: "customerName" },
                    { label: "Invoice Number", key: "invoiceNumber" },
                    { label: "Supplier Name", key: "supplierName" },
                    { label: "Date", key: "date" },
                    { label: "Product Name", key: "productName" },
                    { label: "Taxable Value", key: "taxableValue" },
                    { label: "GST ID", key: "gstId" },
                    { label: "Total Amount", key: "totalAmount" },
                    { label: "Quantity", key: "quantity" },
                  ]}
                  filename={"invoice_data.csv"}
                >
                  <button className="w-full sm:w-auto bg-red-600 text-white font-lexend font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300">
                    Download CSV
                  </button>
                </CSVLink>
              </div>
            </div>
          )}
        </main>
      </div>

    </div>
  );
};

export default Page;
