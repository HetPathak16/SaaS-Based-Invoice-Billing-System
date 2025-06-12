const Joi = require('joi');

exports.clientSchema = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    address: Joi.string().trim().optional(),
    company: Joi.string().trim().required(),
    created_by: Joi.number().required()
});