import { Router } from "express";
import { createUrl, openUrl, urlById } from "../controllers/urlController.js";
import { schemaValidation } from "../middlewares/schemaValidation.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";
import urlSchema from "../schemas/urlSchema.js";


const urlRouter = Router()

urlRouter.post('/urls/shorten', schemaValidation(urlSchema),
                                tokenValidation,
                                createUrl)
urlRouter.get('/urls/:id', urlById)
urlRouter.get('/urls/open/:shortUrl', openUrl )

export default urlRouter