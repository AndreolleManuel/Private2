import Joi from "joi";

export const createUserSchema = Joi.object({
  mail: Joi.string().min(2).max(100).trim().required(),
  password: Joi.string().min(6).max(100).trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/).required(),
  confirmPassword: Joi.string().min(6).max(100).trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/).required(),
  role: Joi.string().valid("user", "admin", "partner").default("user"),
});

export const loginUserSchema = Joi.object({
  mail: Joi.string().min(2).max(100).trim().required(),
  password: Joi.string().min(2).max(100).trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/).required()
});

export const createOrderUserDataSchema = Joi.object({
  firstname: Joi.string().min(2).max(100).trim().required(),
  lastname: Joi.string().min(2).max(100).trim().required(),
  address_number: Joi.string().min(2).max(100).trim().required(),
  address_streetname: Joi.string().min(2).max(100).trim().required(),
  postal_code: Joi.string().min(2).max(100).trim().required(),
  city: Joi.string().min(2).max(100).trim().required(),
  phone_number: Joi.string().min(2).max(100).trim().required()
});

export const updateUserPasswordSchema = Joi.object({
  current_password: Joi.string().min(6).max(100).trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/).required(),
  new_password: Joi.string().min(6).max(100).trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/).required(),
  confirm_password: Joi.string().min(6).max(100).trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/).required(),
});

export const updateUserSchema = Joi.object({
  mail: Joi.string().min(2).max(100).trim(),
  firstname: Joi.string().min(2).max(100).trim(),
  lastname: Joi.string().min(2).max(100).trim(),
  address_number: Joi.string().max(100).trim(),
  address_streetname: Joi.string().min(2).max(100).trim(),
  postal_code: Joi.string().min(2).max(100).trim(),
  city: Joi.string().min(2).max(100).trim(),
  phone_number: Joi.string().min(2).max(100).trim().empty(""),
}).or("mail", "firstname", "lastname", "address_number", "address_streetname", "postal_code", "city", "phone_number");

export const createUserSchemaBO = Joi.object({
  mail: Joi.string().min(2).max(100).required(),
  password: Joi.string()
    .min(6)
    .max(100)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .required(),
  confirmPassword: Joi.string()
    .min(6)
    .max(100)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .required(),
  role: Joi.string().valid("admin", "partner", "user").default("admin"),
});
export const updateUserSchemaBO = Joi.object({
  mail: Joi.string().min(2).max(100),
  role: Joi.string().valid("admin", "partner", "user"),
}).or("mail", "role");
