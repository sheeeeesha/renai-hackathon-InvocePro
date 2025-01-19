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

  // const handleGenerateTable = async () => {
  //   console.log("handleGenerateTable invoked");
  //   try {
  //     console.log("Fetching data from the backend...");
  //     const response = await fetch("http://localhost:5000/start-process", {
  //       method: "GET", // Adjust this if your backend expects a POST
  //     });

  //     if (response.ok) {
  //       console.log("Backend responded successfully.");
  //       const responseData = await response.json();
  //       console.log("Response data from backend:", responseData);

  //       // Log the full response to check its structure
  //       console.log("Full Backend Response:", responseData);

  //       // Check if the response contains the 'data' field and process each entry
  //       if (responseData.success && responseData.data && Array.isArray(responseData.data)) {
  //         console.log("Processing extracted data...");

  //         // Process each entry in the 'data' field, especially 'table.content'
  //         const processedDataPromises = responseData.data.map(async (item) => {
  //           if (item.table && item.table.content) {
  //             try {
  //               // Check if content is valid JSON
  //               const parsedContent = JSON.parse(item.table.content);
  //               console.log("Parsed Content:", parsedContent);
  //               return parsedContent;
  //             } catch (error) {
  //               console.error("Error parsing content:", error);
  //               // Handle cases where the content is not valid JSON
  //               return {};
  //             }
  //           } else {
  //             console.error("No valid content found in table:", item);
  //             return {};
  //           }
  //         });

  //         const processedData = await Promise.all(processedDataPromises);
  //         console.log("Processed Data:", processedData);

  //         // Map processed data to the table format
  //         const mappedTableData = processedData.map((entry) => ({
  //           customerName: entry["Customer Name"] || "N/A",
  //           invoiceNumber: entry["Invoice Number"] || "N/A",
  //           supplierName: entry["Supplier Name"] || "N/A",
  //           date: entry["Date"] || "N/A",
  //           productName: Array.isArray(entry["Product Name"]) ? entry["Product Name"].join(", ") : entry["Product Name"] || "N/A",
  //           taxableValue: entry["Taxable Value"] || "N/A",
  //           gstId: entry["GST ID"] || "N/A",
  //           totalAmount: entry["Total Amount"] || "N/A",
  //           quantity: Array.isArray(entry["Quantity"]) ? entry["Quantity"].join(", ") : entry["Quantity"] || "N/A",
  //         }));

  //         // Set the table data state with the processed and mapped data
  //         setTableData(mappedTableData);

  //         setShowTable(true); // Show the table
  //         console.log("Table data set successfully.");
  //       } else {
  //         console.error("Invalid response format or no valid data:", responseData);
  //         alert("Failed to process data. Please check the console for details.");
  //       }
  //     } else {
  //       console.error("Failed to fetch data from backend. Status:", response.status);
  //       alert("Failed to fetch data from backend. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error in handleGenerateTable:", error);
  //     alert("An error occurred while generating the table. Please check the console for details.");
  //   }
  // };

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
          const processedDataPromises = responseData.data.map(async (item) => {
            if (item.table && item.table.content) {
              try {
                // Step 1: Clean the string by removing backticks and newline characters
                let cleanedContent = item.table.content.replace(/^```json\n/, '').replace(/```\n$/, '').trim();
  
                // Step 2: Parse the cleaned content to JSON
                const parsedContent = JSON.parse(cleanedContent);
                console.log("Parsed Content:", parsedContent);
                return parsedContent;
              } catch (error) {
                console.error("Error parsing content:", error);
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-700 via-purple-500 to-blue-400">
      <Header />

      <div className="flex-1 flex flex-col items-center px-4 py-8">
        <main className="w-full lg:w-3/5 p-16 bg-white rounded-lg shadow-xl">
          {/* Show the form if PDFs and table are not displayed */}
          {!showPDFs && !showTable && (
            <>
              <h2 className="text-3xl font-extrabold text-center text-purple-800 mb-6">
                Enter Details
              </h2>
              <p className="text-gray-700 text-center mb-6 text-lg">
                Extract and organize data seamlessly by connecting to your
                Gmail. Specify parameters like start/end dates and keywords to
                retrieve PDFs such as invoices and receipts. Review, organize,
                and download structured data effortlessly.
              </p>
              <ColumnForm
                columns={columns}
                handleColumnChange={handleColumnChange}
              />
              <button
                onClick={handleGeneratePDFs} // Trigger the API call here
                className="w-full sm:w-auto bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 mt-6"
              >
                Generate PDFs
              </button>
            </>
          )}

          {/* Show the generated PDFs and the button to generate the table */}
          {showPDFs && pdfData.length > 0 && (
            <>
              <h2 className="text-3xl font-extrabold text-center text-purple-800 mb-6">
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

              {/* Button to show the table */}
              {!showTable && (
                <div className="mt-8 text-center">
                  <h3 className="text-xl text-purple-800 mb-4">
                    Generated PDFs
                  </h3>
                  <button
                    onClick={handleGenerateTable} // Trigger the backend process and show the table
                    className="w-full sm:w-auto bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                  >
                    Generate Table
                  </button>
                </div>
              )}

              {/* Button to go back to the start */}
              <button
                onClick={handleBackToStart}
                className="w-full sm:w-auto bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-yellow-700 transition duration-300 mt-6"
              >
                Back to Start
              </button>
            </>
          )}

          {/* Show the table when showTable is true */}
          {showTable && tableData.length > 0 && (
            <div className="mt-8 text-center">
              <h3 className="text-xl text-purple-800 mb-4">Generated Table</h3>
              <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-purple-700">
                        Customer Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-purple-700">
                        Invoice Number
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-purple-700">
                        Supplier Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-purple-700">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-purple-700">
                        Product Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-purple-700">
                        Taxable Value
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-purple-700">
                        GST ID
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-purple-700">
                        Total Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-purple-700">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={index}>
                        <td className="px-6 py-3 text-sm text-gray-700">
                          {row.customerName}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">
                          {row.invoiceNumber}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">
                          {row.supplierName}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">
                          {row.date}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">
                          {row.productName}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">
                          {row.taxableValue}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">
                          {row.gstId}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">
                          {row.totalAmount}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">
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
                  <button className="w-full sm:w-auto bg-red-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-300">
                    Download CSV
                  </button>
                </CSVLink>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Page;
