/**
 * =========================================================================
 * PROMEC / AMEC AQUAFORCE - UNIFIED GOOGLE APPS SCRIPT WEBHOOK
 * =========================================================================
 * Handles incoming webhooks for:
 * 1. Signups (OTP Verified Leads & Newsletter Subscribers)
 * 2. Enquiries (B2B Bulk Enquiries & Contact Form)
 * 3. Purchases (Order Checkout, COD Advance & Full Online Payments)
 * =========================================================================
 */

// Target Google Sheets IDs
var SHEET_IDS = {
  SIGNUPS: "1dkGW8QaEeLr3kqaDwq1mQjEVUMI_b7Z-x7v3smDs1w8",
  ENQUIRIES: "1hvv7rdsR2f90Dafj6ADTox9w8w0M6-SLBrNyMk7Ti4U",
  PURCHASES: "1h1URjIYUUQuj_cyg2LotU1x4JTH0PrPOFhVyrTYCWJw"
};

// Column Definitions
var HEADERS = {
  SIGNUPS: [
    "Timestamp",
    "Full Name",
    "Phone Number",
    "Email",
    "Source",
    "Status"
  ],
  ENQUIRIES: [
    "Timestamp",
    "Full Name",
    "Phone Number",
    "Company Name",
    "Email",
    "Quantity",
    "Notes / Requirements",
    "Status"
  ],
  PURCHASES: [
    "Timestamp",
    "Order ID",
    "Payment ID",
    "Payment Method",
    "Product",
    "Quantity",
    "Total Amount (INR)",
    "Advance Paid (INR)",
    "COD Balance Due (INR)",
    "Customer Name",
    "Phone Number",
    "Alternate Phone",
    "Email",
    "Delivery Address",
    "City",
    "State",
    "Pincode",
    "GST Number",
    "Waybill / AWB",
    "Order Status"
  ]
};

/**
 * Handle incoming GET requests (Health check)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "OK",
    message: "AMEC Aquaforce Webhook Endpoint is Active",
    sheets: {
      signups: SHEET_IDS.SIGNUPS,
      enquiries: SHEET_IDS.ENQUIRIES,
      purchases: SHEET_IDS.PURCHASES
    }
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle incoming POST requests
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Wait up to 10 seconds to avoid race conditions

  try {
    var rawData = e && e.postData && e.postData.contents ? e.postData.contents : null;
    var data = {};

    if (rawData) {
      try {
        data = JSON.parse(rawData);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy, hh:mm:ss a");
    var targetType = (data.type || "").toUpperCase();

    // Determine target sheet if type is not explicitly provided
    if (!targetType) {
      if (data.orderId || data.paymentId || data.advanceAmount !== undefined) {
        targetType = "PURCHASE";
      } else if (data.companyName || data.quantity > 1 || data.notes) {
        targetType = "ENQUIRY";
      } else {
        targetType = "SIGNUP";
      }
    }

    var resultMessage = "";

    // 1. Process Purchases
    if (targetType === "PURCHASE" || targetType === "PURCHASES") {
      var purchaseSheet = getSheetById(SHEET_IDS.PURCHASES);
      setupHeaders(purchaseSheet, HEADERS.PURCHASES);

      var altPhone = data.alternatePhone || data.altPhone || "N/A";
      var waybill = data.waybill || data.shiprocketWaybill || "PENDING";

      purchaseSheet.appendRow([
        timestamp,
        data.orderId || "N/A",
        data.paymentId || "N/A",
        data.paymentMethod || "Full Online Payment",
        data.product || "AMEC Aquaforce 1400",
        Number(data.quantity) || 1,
        Number(data.amount) || 44991,
        Number(data.advanceAmount) || 0,
        Number(data.codBalance) || 0,
        data.fullName || "N/A",
        data.phone ? "'" + String(data.phone) : "N/A",
        altPhone !== "N/A" ? "'" + String(altPhone) : "N/A",
        data.email || "N/A",
        data.deliveryAddress || "N/A",
        data.city || "N/A",
        data.state || "N/A",
        data.pincode ? "'" + String(data.pincode) : "N/A",
        data.gstNumber || "N/A",
        waybill,
        data.status || "CONFIRMED"
      ]);
      resultMessage = "Purchase recorded successfully";
    }

    // 2. Process Enquiries
    else if (targetType === "ENQUIRY" || targetType === "ENQUIRIES") {
      var enquirySheet = getSheetById(SHEET_IDS.ENQUIRIES);
      setupHeaders(enquirySheet, HEADERS.ENQUIRIES);

      enquirySheet.appendRow([
        timestamp,
        data.fullName || "N/A",
        data.phone ? "'" + String(data.phone) : "N/A",
        data.companyName || "N/A",
        data.email || "N/A",
        Number(data.quantity) || 1,
        data.notes || "N/A",
        data.status || "New Enquiry"
      ]);
      resultMessage = "Enquiry recorded successfully";
    }

    // 3. Process Signups / Leads / Newsletter
    else {
      var signupSheet = getSheetById(SHEET_IDS.SIGNUPS);
      setupHeaders(signupSheet, HEADERS.SIGNUPS);

      signupSheet.appendRow([
        timestamp,
        data.fullName || data.name || "N/A",
        data.phone ? "'" + String(data.phone) : "N/A",
        data.email || "N/A",
        data.source || "Website Lead",
        data.status || "Verified"
      ]);
      resultMessage = "Signup recorded successfully";
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: resultMessage,
      type: targetType
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Helper to open sheet by ID and get the first sheet tab
 */
function getSheetById(sheetId) {
  var spreadsheet = SpreadsheetApp.openById(sheetId);
  return spreadsheet.getSheets()[0];
}

/**
 * Helper to create formatted headers if sheet is empty
 */
function setupHeaders(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var range = sheet.getRange(1, 1, 1, headers.length);
    range.setFontWeight("bold");
    range.setBackground("#0066cc");
    range.setFontColor("#ffffff");
    range.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    for (var i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }
}
