import { Request, Response } from "express";
import { AppDataSource } from "../config";
import { Certificate } from "../entity/certificate.entity";
import { UserInfo } from "../entity/user.entity";

// Create Certificate 

export const createCertificate = async (req: Request, res: Response) => {
    const { userId, courseName } = req.body;
    const users = AppDataSource.getRepository(UserInfo);
    const certificateData = AppDataSource.getRepository(Certificate);

    if (!userId || !courseName) {
        return res.status(404).json({ message: "certificate not found" })
    }
    try {
        const user = await users.findOne({ where: { id: req.user?.id } })
        if (!user) {
            return res.status(404).json({
                message: "user not found",
            })
        }

        const certificates = new Certificate();
        certificates.user = user
        certificates.courseName = courseName
        await certificateData.save(certificates)

        res.status(201).json({
            id: certificates.id,
            userId: user.id,   
            courseName: certificates.courseName,
            createdAt: certificates.createdAt
        })

    } catch (err) {
        return res.status(500).json({
            message: "Interal server not found"
        })
    }
}

// Get All Certificates for a User 


export const getCertificatesByUser = async (req: Request, res: Response) => {
    const certificateRepo = AppDataSource.getRepository(Certificate);
    const { userId } = req.params;

    try {
        const certificates = await certificateRepo.find({
            where: { user: { id: userId } },
            select: ["id", "courseName", "createdAt"]
        });

        return res.status(200).json(certificates);
    } catch (error) {
        return res.status(500).json({ error: "Error fetching certificates" });
    }
};

// Get Certificate By ID 

export const getCertificateById = async (req: Request, res: Response) => {
    const certificateRepo = AppDataSource.getRepository(Certificate);
    const { id } = req.params;

    try {
        const certificate = await certificateRepo.findOne({
            where: { id },
            relations: ["user"],
            select: ["id", "courseName", "createdAt"]
        });

        if (!certificate) {
            return res.status(404).json({ error: "Certificate not found" });
        }

        return res.status(200).json(certificate);
    } catch (error) {
        return res.status(500).json({ error: "Error fetching certificate" });
    }
};

// Delete Certificate 

export const deleteCertificate = async (req: Request, res: Response) => {
    const certificateRepo = AppDataSource.getRepository(Certificate);
    const { id } = req.params;

    try {
        const certificate = await certificateRepo.findOne({ where: { id } });
        if (!certificate) {
            return res.status(404).json({ error: "Certificate not found" });
        }

        await certificateRepo.remove(certificate);
        return res.status(200).json({ message: "Certificate deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Error deleting certificate" });
    }
};