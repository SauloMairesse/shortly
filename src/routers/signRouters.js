import { Router } from "express";
import { signIn, signUp } from "../controllers/signController.js";
import { schemaValidation } from "../middlewares/schemaValidation.js";
import signInSchema from "../schemas/signInSchema.js";
import signUpSchema from "../schemas/signUpSchema.js";

const signRouter = Router()

signRouter.post('/signup',  schemaValidation(signUpSchema), 
                            signUp)
signRouter.post('/singin',  schemaValidation(signInSchema), 
                            signIn)

export default signRouter