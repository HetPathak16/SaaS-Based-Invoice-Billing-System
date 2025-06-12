const jwt =require('jsonwebtoken')
const bcrypt =require('bcryptjs')
const { authSchema , loginSchema , companySchema} =require('../validation/authValidation');
const { insertData , selectData } =require('../models/dbFunction');
const { sendResponse } =require('../models/responsehandler');
const tokenBlacklist = require('../utils/blackListToken');

exports.registerCompany = async (req, res) => {
    const{error,value} = companySchema.validate(req.body);
    if(error) return sendResponse(res,400,'error in validation',error.details[0].message)

    const { companyName , address , phone , website , adminFirstName , adminLastName , adminEmail , adminPassword , created_by } = value;
    try {
        const company = await selectData('companies',{ name:companyName })
        if(company.length) return sendResponse(res,400,'company already register')

        const result =await insertData('companies', { name: companyName, address, phone, website , created_by });

        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await insertData('users', {
            firstname: adminFirstName,
            lastname:adminLastName,
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            company_id:result.insertId
        });
        return sendResponse(res, 201, 'Company and admin registered successfully');
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, 'Registration failed', null, error.message);
    }
}

// exports.registerCompany = async (req, res) => {
//     const{error,value} = companySchema.validate(req.body);
//     if(error) return sendResponse(res,400,'error in validation',error.details[0].message)
//     const {companyName, address, phone, website, created_by} = value;
//     try {
//         const exist =await selectData('companies',{name:companyName})
//         if(exist)return sendResponse(res,400,'company already exist')
//         const company = await insertData('companies', { name: companyName, address, phone, website, created_by});
//         return sendResponse(res, 201, 'Company registered successfully',company);
//     } catch (error) {
//         return sendResponse(res, 500, 'Registration failed', null, error.message);
//     }
// };

exports.signUp = async(req,res)=>{
    const { error, value } = authSchema.validate(req.body);
    if(error){
        return sendResponse(res,400,'error in validation',error.details[0].message)
    }
    const {firstname,lastname,email,password,role} =value
    try {
        const existinguser = await selectData('users',{email})
        if(existinguser.length){
            return sendResponse(res,400,'user already exist please login') 
        }
        const hashpassword = await bcrypt.hash(password,10);
        const newuser =await insertData('users',{ firstname , lastname , email , password:hashpassword , role})
        console.log(newuser)
        return sendResponse(res,201,'user create successfully',newuser)
    } catch (error) {
        console.log(error)
        sendResponse(res,500,'internal server error',{error:error.message})
    }
}

exports.login = async (req,res) =>{
    const { error,value } =loginSchema.validate(req.body)
    if(error){
        return sendResponse(res,400,'error in  validation',error.details[0].message)
    }
    const {email,password} =value;
    try {
        const user = await selectData('users',{email})
        if(!user.length){
            return sendResponse(res,400,'user not found')
        }
        const ismatch =await bcrypt.compare(password,user[0].password)
        if(!ismatch) return sendResponse(res,400,'incorrect password')
        console.log(user[0].company_id)
        console.log( {id: user[0].id,company_id:user[0].company_id,role: user[0].role} )
        const token =jwt.sign({ id: user[0].id,company_id:user[0].company_id,role: user[0].role }, process.env.JWT_SECRET, { expiresIn: '8h' });

        return sendResponse(res,200,'user login successfully',token)
    } catch (error) {
        return sendResponse(res,500,'internal server error',null,error.message)
    }
}

exports.profile =async (req,res) =>{
    const {id} =req.body;
    try {
        const user = await selectData('users' ,{id})
        if(!user.length) return sendResponse(res,400,'user not found');
        return sendResponse(res,200,'User Profile', user )
    } catch (error) {
        return sendResponse(res,500,'internal server error',error.message)
    }
}

exports.logout = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return sendResponse(res, 400, "No token provided");
    tokenBlacklist.add(token);
    return sendResponse(res, 200, "Logout successful. Token expired.");
};
