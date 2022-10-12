import Joi from "joi";

const signInSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
  })

export default signInSchema