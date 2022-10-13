import { Router } from "express";
import rankingRouter from "./rankingRouter.js";
import signRouter from "./signRouters.js";
import urlRouter from "./urlRouters.js";
import usersRouter from "./usersRouter.js";

const router = Router()

router.use(signRouter)
router.use(urlRouter)
router.use(usersRouter)
router.use(rankingRouter)

export default router