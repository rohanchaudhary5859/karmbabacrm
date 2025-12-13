import { Router } from "express";

const router = Router();

router.get("/test", (req, res) => {
  res.json({ message: "API Route Working ✔" });
});

export default router;
