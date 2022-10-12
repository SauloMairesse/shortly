import { Router } from "express";
import rankingRouter from "./rankingRouter";
import signRouter from "./signRouters";
import urlRouter from "./urlRouters";
import usersRouter from "./usersRouter";

const router = Router()

router.use(signRouter)
router.use(urlRouter)
router.use(usersRouter)
router.use(rankingRouter)

export default router