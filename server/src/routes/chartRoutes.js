import express from "express";
import { createChart, deleteChart, getCharts } from "../controllers/chartController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getCharts)
router.post("/", authMiddleware, createChart);
router.delete("/:id", deleteChart);

export default router;
