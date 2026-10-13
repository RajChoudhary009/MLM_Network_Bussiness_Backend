import { Request, Response } from "express";
import { Address } from "../../models/mongo_database/users/address";
import { IAddress } from "../../interfaces/user";

export const createAddress = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { house, street, city, state, pincode }: IAddress = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required"
            });
        }

        const address = await Address.create({
            userId,
            house,
            street,
            city,
            state,
            pincode
        });

        return res.status(201).json({
            success: true,
            message: "Address created successfully",
            data: address
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create address"
        });
    }
};