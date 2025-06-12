const Joi = require('joi');

exports.taxSchema = Joi.object({
    name: Joi.string().max(255).required(),
    rate: Joi.number().precision(2).min(0).max(100).required()
});

exports.taxSchema = Joi.object({
    name: Joi.string().trim().max(255).required(),
    rate: Joi.number().min(0).max(100).required()
});