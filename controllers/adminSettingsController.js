const { selectData, updateData } =require('../models/dbFunction');
const { sendResponse } = require('../models/responsehandler');
const { companySchema } =require('../validation/authValidation')

exports.UpdateCompanyInfo = async (req,res) =>{
    const { id } =req.params
    const { error , value } = companySchema.validate(req.body)
    if(error) return sendResponse(res,400,'error in validation',error.details[0].message)
        const { companyName , address , phone , website , created_by } = value
    try {
        const company = await selectData('companies',{ id });
        console.log(company);
        if(!company.length) return sendResponse(res, 404 ,'company not found');
        const updated = await updateData('companies',{ name:companyName , address , phone , website , created_by},{ id })
        return sendResponse( res , 200 ,'data updated successfuily', updated)
    } catch (error) {
        return sendResponse( res , 500 ,'internal server error', null , error)
    }
};

exports.uploadCompanyLogo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Logo file is required' });
        }
        const logoUrl = `${req.protocol}://${req.get('host')}/uploads/logos/${req.file.filename}`;
        return sendResponse(res,200,'Logo uploaded successfully', { logo_url:logoUrl })
    } catch (error) {
        console.error('Error uploading logo:',error);
        return sendResponse(res,500,'internal server error',error.message);
    }
};

exports.GetCompanySetting = async(req,res) =>{
    try {
        const company_setting = ['change_companyName','change_address','change_phone','change_website','change_ClientId']
        return sendResponse(res,200,'get company setting', company_setting)
    } catch (error) {
        return sendResponse(res,500,'internal server error',null,error.message)
    }
};
