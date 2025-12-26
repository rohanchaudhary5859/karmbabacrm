import { Router } from "express";
const router = Router();

// Import route modules
import authRoutes from './auth.js';
import clientRoutes from './client.js';
import interactionRoutes from './interaction.js';
import taskRoutes from './task.js';
import clientSegmentRoutes from './clientSegment.js';
import reportRoutes from './report.js';
import emailRoutes from './email.js';
import documentRoutes from './document.js';
import searchRoutes from './search.js';

// Register routes
router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/interactions', interactionRoutes);
router.use('/tasks', taskRoutes);
router.use('/segments', clientSegmentRoutes);
router.use('/reports', reportRoutes);
router.use('/email', emailRoutes);
router.use('/documents', documentRoutes);
router.use('/search', searchRoutes);

router.get("/test", (req, res) => {
  res.json({ message: "API Route Working ✔" });
});

export default router;