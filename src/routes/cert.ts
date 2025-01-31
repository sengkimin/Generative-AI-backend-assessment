import { Router } from "express";
import protectRoute from "../middleware/auth";
import { createCertificate,getCertificatesByUser,getCertificateById,deleteCertificate } from "../controllers/certificate";

const router = Router();
router.post("/create", protectRoute(), createCertificate);
router.get("/:userId", protectRoute(), getCertificatesByUser);
router.get("/get/:id", getCertificateById);
router.delete("/delete/:id", protectRoute(), deleteCertificate);




export default router;