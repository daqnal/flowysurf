import express from "express";
import { createChart, deleteChart } from "../controllers/chartController.js";

const router = express.Router();

router.post("/create", createChart);
router.delete("/:id", deleteChart);

export default router;
