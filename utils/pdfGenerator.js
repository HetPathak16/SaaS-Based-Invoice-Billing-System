const fs = require('fs');
const path = require('path');
const easyinvoice = require('easyinvoice');

exports.generateInvoicePDF = async (invoiceData, fileName = 'invoice.pdf') => {
    try {
        const result = await easyinvoice.createInvoice(invoiceData);
        const pdfPath = path.join(__dirname, `../uploads/invoices/${fileName}`);
        fs.writeFileSync(pdfPath, result.pdf, 'base64');
        return pdfPath;
    } catch (error) {
        throw new Error('PDF generation failed: ' + error.message);
    }
};