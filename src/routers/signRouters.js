import { Router } from "express";
import { signUp } from "../controllers/signController.js";
import { schemaValidation } from "../middlewares/schemaValidation.js";
import signUpSchema from "../schemas/signUpSchema.js";

const signRouter = Router()

signRouter.post('/signup',  schemaValidation(signUpSchema), 
                            signUp)

export default signRouter