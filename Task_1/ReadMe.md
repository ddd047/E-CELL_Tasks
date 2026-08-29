# 🚀 Startup Pitch Competition - Registration System

A lightweight, responsive web registration form built for the E-Cell Startup Pitch Competition. It validates user inputs on the frontend and automatically stores participant submissions in a Google Sheet backend in real time.

---

## 🛠️ How This System Was Created

The goal was to build a simple, serverless backend without managing databases or paying for hosting services. Here is the step-by-step process of how the Google Sheet backend and integration were set up:

### Step 1: Setting Up the Google Sheet
1. Created a new Google Spreadsheet named **Startup Pitch Registrations**.
2. Reserved the first row for field headers:
   * **Column A:** `Timestamp`
   * **Column B:** `Full Name`
   * **Column C:** `Email`
   * **Column D:** `Phone`
   * **Column E:** `Team Name`
   * **Column F:** `Startup Idea`

### Step 2: Writing the Google Apps Script Backend
1. Opened the sheet's built-in code editor via **Extensions > Apps Script**.
2. Wrote a custom script to handle incoming requests:
   * `doGet()`: Returns a simple health check message when accessed directly in a browser.
   * `doPost(e)`: Reads the form data sent from the website, formats the values, and calls `sheet.appendRow()` to insert the submission as a new row in real time.
   * Added `LockService` to handle simultaneous submissions without data collisions.

### Step 3: Deploying as a Public Web App
1. Clicked **Deploy > New deployment** in Apps Script.
2. Selected **Web app** as the deployment type.
3. Configured the permissions:
   * **Execute as:** *Me* (the sheet owner).
   * **Who has access:** *Anyone* (allows external users to submit data without logging in).
4. Copied the generated Web App endpoint URL (ending in `/exec`).

### Step 4: Connecting the Frontend Form
1. Built a clean, mobile-responsive HTML/CSS/JS form (`index.html`) with validation for names, emails, 10-digit mobile numbers, and pitch descriptions.
2. Configured JavaScript's native `fetch()` API to send the validated form inputs as URL-encoded data directly to the Google Apps Script Web App URL.
3. Added UI feedback states for loading spinners and success confirmation screens.

---

## 📁 Tech Stack
* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Backend:** Google Apps Script (Serverless Web App endpoint)
* **Database:** Google Sheets
* **Hosting**(if required)**:** GitHub Pages / Vercel / Netlify

---

## 🧪 How to Test It
1. Open the live page in your browser.
2. Fill in all fields with valid data and click **Submit Pitch Registration**.
3. Open the linked Google Sheet to verify that a new row has appeared with the submitted data and a timestamp.