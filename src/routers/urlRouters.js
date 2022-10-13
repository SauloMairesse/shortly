import { Router } from "express";
import { createUrl } from "../controllers/urlController.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";


const urlRouter = Router()

urlRouter.post('/urls/shorten', tokenValidation, createUrl)

export default urlRouter