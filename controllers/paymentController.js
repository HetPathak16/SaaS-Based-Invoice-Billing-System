const {selectData , insertData} = require('../models/dbFunction')
const { sendResponse } =require('../models/responsehandler');

exports.recordPayment = async (req, res) => {
    const { invoiceId } = req.params;
    const { method } = req.body;
    try {
        const payment = await selectData('invoices',{id:invoiceId});
        if(!payment.length) return sendResponse(res,400,'invoice not found');
        const newPayment = await insertData('payments',{amount:payment[0].total,method,date:payment[0].date})
        return sendResponse(res,201,'payment successfull',newPayment)
    } catch (error) {
        return sendResponse(res,500,'internal server error',null,error.message)
    }
};

exports.getPayments = async (req, res) => {
    const { invoiceId } = req.params;
    try {
        const payments = await selectData("payments",{},{ invoiceId });
        if(!payments.length) return sendResponse(res,400,'payment not found')
        return sendResponse(res, 200, "Payments retrieved", { payments });
    } catch (error) {
        return sendResponse(res,500,'internal server error',null, error.message)
    }
};