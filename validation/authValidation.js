const Joi = require('joi');

exports.authSchema = Joi.object({
    firstname: Joi.string().alphanum().trim().required(),
    lastname:Joi.string().alphanum().trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().alphanum().min(6).trim().required(),
    role: Joi.string().valid('user','admin').trim().optional()
});

exports.loginSchema = Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(6).trim().required()
});

exports.companySchema = Joi.object({
    companyName: Joi.string().trim().required(),
    address: Joi.string().trim().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    website: Joi.string().uri().required(),
    adminFirstName: Joi.string().pattern(/^[a-zA-Z]+$/).trim().required(),
    adminLastName: Joi.string().pattern(/^[a-zA-Z]+$/).trim().required(),
    adminEmail: Joi.string().email().trim().required(),
    adminPassword: Joi.string().min(6).required(),
    created_by: Joi.number().integer().required()
});

// exports.companySchema = Joi.object({
//     companyName:Joi.string().trim().required(),
//     address:Joi.string().trim().required(),
//     phone:Joi.string().length(10).required(),
//     website:Joi.string().trim().required(),
//     created_by:Joi.number().required()
// })