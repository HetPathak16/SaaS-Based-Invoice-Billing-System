const fs =require('fs')
const {selectData} =require('../models/dbFunction');
const {sendResponse} =require('../models/responsehandler');

exports.summary = async (req, res) => {
    try {
        const invoices = await selectData("invoices");
        if(!invoices.length) return sendResponse(res,400,'error in fetching data');
        const totalRevenue = invoices.reduce((sum, inv) => sum + parseFloat(inv.total), 0);
        const invoiceCount = invoices.length;
        return sendResponse(res, 200, "Summary report", { totalRevenue, invoiceCount });
    } catch (error) {
        return sendResponse(res,500,'internal server error',null,error.message)
    }
};

exports.monthlyReport = async (req, res) => {
    try {
        const invoices = await selectData("invoices");
        if (!invoices.length) {
            return sendResponse(res, 400, 'No invoices found');
        }
        const monthly = {};

        for (const invoice of invoices) {

            const date = new Date(invoice.date);
            if (isNaN(date)) continue; // skip if the date is invalid

            // "YYYY-MM" 
            const month = date.toISOString().slice(0, 7);

            const total = parseFloat(invoice.total) || 0;
            if (monthly[month]) {
                monthly[month] += total;
            } else {
                monthly[month] = total;
            }
        }
        return sendResponse(res, 200, "Monthly report", { monthly });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, 'Internal server error', null, error.message);
    }
};

exports.exportCSV = async (req, res) => {
    try {
        const invoices = await selectData("invoices");
        if(!invoices.length) return sendResponse(res,400,'error in fetching invoice')
        const csv = invoices.map(inv =>
            `${inv.id},${inv.date},${inv.total}`
        ).join("\n");
        fs.writeFileSync("reports.csv", csv);
        res.download("reports.csv");
        
    } catch (error) {
        return sendResponse(res,500,'internal server error',null,error.message)
    }
};