const Joi = require('joi');

exports.itemSchema = Joi.object({
    name: Joi.string().trim().required(),
    price: Joi.number().positive().required(),
    category: Joi.string().trim().required(),
    quantity: Joi.number().integer().min(1).required()
});