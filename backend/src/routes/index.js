import { Router } from "express";
const router = Router();

// Import route modules
import authRoutes from './auth.js';
import clientRoutes from './client.js';
import interactionRoutes from './interaction.js';
import taskRoutes from './task.js';
import clientSegmentRoutes from './clientSegment.js';
import reportRoutes from './report.js';

// Register routes
router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/interactions', interactionRoutes);
router.use('/tasks', taskRoutes);
router.use('/segments', clientSegmentRoutes);
router.use('/reports', reportRoutes);

router.get("/test", (req, res) => {
  res.json({ message: "API Route Working ✔" });
});

export default router;