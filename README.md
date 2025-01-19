
# **InvoicePro - Intelligent Invoice Extraction and Analysis Tool**  
*Developed by InvoSync Squad*
## **Team: InvoSync Squad**
Ashish Tamhankar |
Anirudh Gupta |
Manan Dadoo |
Keshav Sonawane 

# **.env variables**
WORQHAT_API_KEY |
WORQHAT_API_URL |
WORQHAT_API_URL2 |
GOOGLE_APPLICATION_CREDENTIALS |
PORT=5000

## **Project Overview**
InvoicePro is a powerful tool designed to automatically extract and analyze relevant data from invoices. Developed with **Next.js** and **Tailwind CSS**, InvoicePro helps businesses and individuals streamline their invoice management process by extracting key details such as customer name, invoice number, product name, GST information, and more. With the integration of Gmail and Firebase, the tool can fetch invoices directly from Gmail, process the contents, and present the data in an easily accessible format.

InvoicePro aims to save time, reduce human error, and improve data processing efficiency for accounting and financial tasks.

---

## **Key Features**
- **Automated Invoice Extraction:** The tool extracts key data fields from invoices, such as customer name, invoice number, supplier name, date, product names, taxable value, GST ID, total amount, and quantity.
- **Seamless Gmail Integration:** InvoicePro can access Gmail accounts to fetch invoices directly from emails with PDF attachments.
- **Data Storage:** Extracted data is stored in a Firebase database for easy retrieval and future analysis.
- **Responsive User Interface:** Built with Tailwind CSS to ensure an intuitive and user-friendly experience across devices.
- **OAuth Authentication:** Ensures secure access to Gmail via the Google OAuth flow.

---

## **Tech Stack**
- **Next.js**: Framework for building the full-stack application.
- **Tailwind CSS**: Utility-first CSS framework for creating a responsive design.
- **Node.js**: Server-side platform for handling API requests.
- **OAuth 2.0**: Authentication mechanism to securely access Gmail.

---

## **Getting Started**

### **Prerequisites**
Make sure you have the following installed on your local machine:
- **Node.js** (version 14 or higher) - [Download Node.js](https://nodejs.org/)
- **npm**, **yarn**, or **pnpm** (for managing dependencies)

### **Clone the Repository**
Start by cloning the repository to your local machine:

```bash
git clone https://github.com/sheeeeesha/renAi-Team-InvoSync.git
cd renAi-Team-InvoSync
```

### **Install Dependencies**
Install the necessary dependencies by running the following command:

```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

### **Set Up Gmail OAuth**
To access Gmail for fetching invoices, follow these steps:
1. Create a project on the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Gmail API** and set up **OAuth credentials**.
3. Replace the placeholders in the project with your OAuth credentials (client ID, client secret).
4. Add your API keys and OAuth credentials to `.env.local`.

### **Run the Development Server**
Run the development server locally:

```bash
# Using npm
# in the renai folder
npm run dev
# in the second terminal
node server/index.js

# Or using yarn
yarn dev

# Or using pnpm
pnpm dev
```

This will start the application at `http://localhost:3000`. Open the URL in your browser to view the application.

---

## **How to Use the Application**

1. **Authenticate with Google**
   - Go to the home page of the app.
   - Click on the **"Authenticate"** button to initiate the Google OAuth authentication process.
   - After signing in with your Google account and granting access to your Gmail, the application will start fetching invoices from your Gmail inbox.

2. **Extract Invoices**
   - The app will look for emails with PDF attachments and extract relevant information such as the customer name, invoice number, product details, taxable value, and more.
   - The extracted data will be displayed in a table format for easy review.

3. **Data Analysis and Storage**
   - The extracted data is stored in **Firebase Firestore** for future access and analysis.
   - Users can review and analyze the extracted data or export it for reporting purposes.

---



## **License**
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---

