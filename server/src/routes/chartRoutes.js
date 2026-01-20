import express from "express";
import { createChart, deleteChart, getChartData, getCharts } from "../controllers/chartController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getCharts);
router.get("/:id", authMiddleware, getChartData);
router.post("/", authMiddleware, createChart);
router.delete("/:id", authMiddleware, deleteChart);

export default router;
