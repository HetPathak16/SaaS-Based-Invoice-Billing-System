const{ taxSchema } =require('../validation/taxesValidation')
const { sendResponse } =require('../models/responsehandler')
const { insertData , selectData , updateData , deleteData} =require('../models/dbFunction')

exports.taxList = async (req, res) => {
    try {
        const company = await selectData('companies')
        console.log(company[0].id)
        const taxes = await selectData('taxes', { company_id: company[0].id, is_active: 1 });
        return sendResponse(res, 200, 'Taxes retrieved successfully', taxes);
    } catch (error) {
        return sendResponse(res, 500, 'Internal server error', error.message);
    }
};

exports.createTax = async (req, res) => {
    const { error, value } = taxSchema.validate(req.body);
    if (error) {
        return sendResponse(res, 400 , 'Validation error', error.details[0].message);
    }
    const { name, rate } = value;
    const company_id = req.user.company_id;
    try {
        const existing = await selectData('taxes', { name, company_id });
        if (existing.length) return sendResponse(res, 400, 'Tax with this name already exists');
        const newTax = await insertData('taxes', {
            name,
            rate,
            company_id,
            is_active: true,
            created_at: new Date()
        });
        return sendResponse(res, 201, 'Tax created successfully', newTax);
    } catch (error) {
        return sendResponse(res, 500, 'Internal server error', error.message);
    }
};

exports.updateTax = async (req, res) => {
    const { id } = req.params;
    const { error, value } = taxSchema.validate(req.body);
    if (error) return sendResponse(res, 400, 'Validation error', error.details[0].message);
    const { name, rate } = value;
    try {
        const company= await selectData('companies');
        if(!company.length) return sendResponse(res,400,'company not find')
            
            const existing = await selectData('taxes', { id, company_id:company[0].id });
            
            if (!existing.length) return sendResponse(res, 400, 'Tax not found');
            
            const updated = await updateData('taxes', { name, rate }, { id });
            return sendResponse(res, 200, 'Tax updated successfully', updated);
        } catch (error) {
            return sendResponse(res, 500, 'Internal server error', error.message);
        }
};

exports.deleteTax = async (req, res) => {
    const { id } = req.params;
    
    try {
        const existing = await selectData('taxes', { id});
        if (!existing.length) return sendResponse(res, 400, 'Tax not found');
        
        const deleted = await deleteData('taxes', { id });
        return sendResponse(res, 200, 'Tax deleted successfully', deleted);
    } catch (error) {
        return sendResponse(res, 500, 'Internal server error', error.message);
    }
};

// exports.createTax = async (req, res) => {
    
    //         const { error, value } = taxSchema.validate(req.body);
    //         if (error) {
        //             return sendResponse(res, 400, 'Validation error', error.details[0].message);
        //         }
        //         const { name, rate } = value;
    //         try {
    //             const company = await selectData('companies');
    //             if (!company.length) return sendResponse(res, 400, 'Company not found for this user');
    
    //             const existing = await selectData('taxes', { name, company_id:company[0].id});
    //             if (existing.length) return sendResponse(res, 400, 'Tax with this name already exists');
    
    //             const newTax = await insertData('taxes', {
    //                 name,
    //                 rate,
    //                 company_id:company[0].id,
    //                 is_active: true,
    //                 created_at: new Date()
    //             });
    //             return sendResponse(res, 201, 'Tax created successfully', newTax);
    //         } catch (error) {
    //             return sendResponse(res, 500, 'Internal server error', error.message);
    //         }
    // };
/*
const Joi = require('joi');
exports.taxSchema = Joi.object({
    name: Joi.string().max(255).required(),
    rate: Joi.number().precision(2).min(0).max(100).required()
    });
    
    
    // exports.listTaxes = async (req, res) => {
        //     try {
            //         const taxes = await selectData("taxes");
            //         if(!taxes.length) return sendResponse(res,400,'get error while fetching taxes list')
            //         return sendResponse(res, 200, "Taxes listed", { taxes });
            //     } catch (error) {
                //        return sendResponse(res, 500, 'internal server error', null, error.message);
                //     }
    // };
    
    // exports.createTax = async (req, res) => {
    //     const { name, rate } = req.body;
    //     try {
    //         const tax = await selectData('taxes',{name});
    //         if(tax.length) return sendResponse(res,400,'tax already exist')
    //         const newtax = await insertData("taxes", { name, rate });
    //         return sendResponse(res, 201, "Tax created",newtax);
    //     } catch (error) {
    //         return sendResponse(res, 500, 'internal server error', null, error.message);
    //     }
    // };
    
    // exports.updateTax = async (req, res) => {
    //     const { id } = req.params;
    //     const { name, rate } = req.body;
    //     try {
    //         const tax = await selectData('taxes',{name});
    //         if(!tax.length) return sendResponse(res,400,'tax not exist')
    //         const updateTax = await updateData('taxes',{name,rate},{id})
    //         return sendResponse(res, 200, "Tax updated",updateTax);
    //     } catch (error) {
    //         return sendResponse(res, 500, 'internal server error', null, error.message);
    //     }
    // };
    
    // exports.deleteTax = async (req, res) => {
    //     const { id } = req.params;
    //     await deleteData("taxes", { id });
    //     return sendResponse(res, 200, "Tax deleted");
    // };
*/
/*
CREATE TABLE taxes(
    id int auto_increment PRIMARY KEY,
    company_id int,
    name varchar(255) -- eg VAT,GST etc,
    rate decimal(5,2), -- eg 18 = 18%
    is_active boolean default true,
    created_at TIMESTAmp
    foreign key (company_id) REFERENCE componies(id);
    )
*/