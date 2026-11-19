const fs = require('fs');
const path = require('path');
const Joi = require('joi');

const optionalText = (max) => Joi.string().trim().max(max).allow('').optional();

const schemas = {
  register: Joi.object({
    firstName: Joi.string().trim().max(50).required(),
    lastName: Joi.string().trim().max(50).required(),
    email: Joi.string().trim().lowercase().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(8).max(72).required(),
    location: optionalText(100),
    description: optionalText(500),
    occupation: optionalText(100)
  }),
  login: Joi.object({
    email: Joi.string().trim().lowercase().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required()
  }),
  photo: Joi.object({
    title: Joi.string().trim().max(100).required(),
    description: optionalText(1000)
  }),
  comment: Joi.object({
    comment: Joi.string().trim().max(1000).required()
  })
};

// Returns a middleware that validates req.body against a Joi schema
const validate = (schemaName) => (req, res, next) => {
  const { error, value } = schemas[schemaName].validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    // If a file was already saved by multer, remove it so no orphan stays on disk
    if (req.file) {
      fs.unlink(path.join(__dirname, '..', 'uploads', req.file.filename), () => {});
    }
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.details.map((d) => d.message.replace(/"/g, ''))
    });
  }

  req.body = value;
  next();
};

module.exports = { validate };
