const fs = require('fs');
const path =  require('path')
const { insertData, selectData , updateData , deleteData } = require('../models/dbFunction');
const { generateInvoicePDF } = require('../utils/pdfGenerator');
const { sendEmailWithAttachment } = require('../utils/emailSender');
const { sendResponse } = require('../models/responsehandler');

exports.createInvoice = async (req, res) => {
    const { client_id, items_id } = req.body;

    try {
        const client = await selectData('clients', { id: client_id });
        if (!client.length) return sendResponse(res, 400, 'Client not found');

        const itemIds = Array.isArray(items_id) ? items_id : [items_id];
        const items = await Promise.all(itemIds.map(id => selectData('items', { id })));
        const flatItems = items.flat();

        if (!flatItems.length) return sendResponse(res, 400, 'Items not found');

        const subtotal = flatItems.reduce((sum, item) => {
            const price = parseFloat(item.price || 0);
            const quantity = parseFloat(item.quantity || 1);
            return sum + quantity * price;
        }, 0);
        
        const taxes = await selectData('taxes', { is_active: 1 });
        const totalTaxRate = taxes.reduce((sum, t) => sum + parseFloat(t.rate || 0), 0);
        const taxAmount = +(subtotal * (totalTaxRate / 100)).toFixed(2);

        const total = +(subtotal + taxAmount).toFixed(2);

        const invoiceData = {
            sender: {
                company: "IdentixWeb Limited",
                address: "1st floor IdentixHouse, Poddar Arcade, to, Lambe Hanuman Rd, Dhameliya Nagar, Ramdarshan Society",
                zip: "395006",
                city: "Surat",
                country: "India"
            },
            client: {
                company: client[0].name,
                address: client[0].address || '',
                zip: client[0].zip || '',
                city: client[0].city || '',
                country: client[0].country || ''
            },
            invoiceNumber: "INV-" + Date.now(),
            invoiceDate: new Date().toISOString().split('T')[0],
            products: flatItems.map(item => ({
                quantity: item.quantity,
                description: item.name || item.Name,
                price: item.price || item.Price
            })),
            images: {
                logo: fs.readFileSync(path.join(__dirname, '../uploads/MunimLogo.png'), 'base64'),
            },
            bottomNotice: "Thank you for your business!"
        };
        
        // Save PDF
        const fileName = `invoice-${Date.now()}.pdf`;
        await generateInvoicePDF(invoiceData, fileName)
        // 7. Insert invoice in DB
        const invoice = await insertData('invoices', {
            client_id,
            date: new Date(),
            total,
            pdf_path: `/uploads/invoices/${fileName}`
        });

        return sendResponse(res, 201, 'Invoice created', {invoice});

    } catch (error) {
        console.error(error.message);
        return sendResponse(res, 500, 'Error creating invoice', null, error.message);
    }
};

exports.listInvoices = async (req, res) => {
    try {
        const invoices = await selectData('invoices');
        return sendResponse(res, 200, 'Invoices fetched', { invoices });
    } catch (err) {
        return sendResponse(res, 500, 'Error listing invoices', null, err.message);
    }
};

exports.getInvoiceDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const invoice = await selectData('invoices', { id });
        if (!invoice.length) return sendResponse(res, 400, 'Invoice not found');
        return sendResponse(res, 200, 'Invoice details', invoice[0]);
    } catch (err) {
        return sendResponse(res, 500, 'Error fetching invoice', null, err.message);
    }
};

exports.updateInvoice = async (req, res) => {
    const { id } = req.params;
    const { client_id, total , pdf_path } = req.body;
    try {
        const existing = await selectData('invoices', { id });
        if (!existing.length) return sendResponse(res, 400, 'Invoice not found');
        const updated = await updateData('invoices', {client_id,total,pdf_path}, {id});
        console.log(updated)
        return sendResponse(res, 200 , 'Invoice updated' , updated);
    } catch (err) {
        return sendResponse(res, 500, 'Error updating invoice', null, err.message);
    }
};

exports.deleteInvoice = async (req, res) => {
    const { id } = req.params;
    try {
        const existing = await selectData('invoices', { id });
        if (!existing.length) return sendResponse(res, 400, 'Invoice not found');

        await deleteData('invoices', { id });
        return sendResponse(res, 200, 'Invoice deleted');
    } catch (err) {
        return sendResponse(res, 500, 'Error deleting invoice', null, err.message);
    }
};

exports.downloadPdf = async (req, res) => {
    const { id } = req.params;
    try {
        const invoice = await selectData('invoices', { id });
        if (!invoice.length) return sendResponse(res, 400, 'Invoice not found');

        const filePath = path.join(__dirname, '..', invoice[0].pdf_path);
        return res.download(filePath)
        // return easyinvoice.download('myinvoice',invoice)
    } catch (err) {
        console.log(err)
        return sendResponse(res, 500, 'Error downloading PDF', null, err.message);
    }
};

exports.sendInvoiceEmail = async (req, res) => {
    const { id } = req.params;
    const { toEmail } = req.body;
    try {
        const invoice = await selectData('invoices', { id });
        if (!invoice.length) return sendResponse(res, 400, 'Invoice not found');

        const attachmentPath = path.join(__dirname, '..', invoice[0].pdf_path);
        console.log(attachmentPath)
        if(!attachmentPath) return sendResponse(res,400,'path not found')
        await sendEmailWithAttachment({
            to: toEmail,
            subject: 'Invoice from YourCompany',
            text: 'Please find your invoice attached.',
            attachmentPath: attachmentPath,
        });
        return sendResponse(res, 200, 'Invoice sent successfully');
    } catch (err) {
        return sendResponse(res, 500, 'Error sending invoice', null, err.message);
    }
};