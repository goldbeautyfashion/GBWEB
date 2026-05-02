import { Router, type IRouter } from "express";
import healthRouter from "./health";
import goldBeautyRouter from "./gold-beauty";

const router: IRouter = Router();

router.use(healthRouter);
router.use(goldBeautyRouter);

export default router;
