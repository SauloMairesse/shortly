import { Router } from "express";
import { userMe } from "../controllers/usersController.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";

const usersRouter = Router()

usersRouter.get(`/user/me`, tokenValidation,
                            userMe)

export default usersRouter