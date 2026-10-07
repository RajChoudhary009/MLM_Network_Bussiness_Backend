import { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import ProductLink from "../../models/mysql_database/productLink/productLink";
import { ProductLinkAttributes } from "../../interfaces/productLink";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
}).single("image");

const addProductLink = (req: Request, res: Response) => {
    upload(req, res, async (err) => {

        if (err) {
            console.error("Multer error:", err);

            return res.status(400).json({
                message: "Image upload failed",
                error: err.message
            });
        }

        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "Please upload an image"
                });
            }

            const {
                product_id,
                main_category,
                price,
                link
            }: ProductLinkAttributes = req.body;

            if (!product_id || !price || !link) {

                const imagePath = path.resolve(
                    "uploads",
                    req.file.filename
                );

                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }

                return res.status(400).json({
                    message: "product_id, price and link are required"
                });
            }

            const image = `uploads/${req.file.filename}`;

            const product = await ProductLink.create({
                product_id: Number(product_id),
                main_category: main_category || null,
                price: Number(price),
                link,
                image
            });

            return res.status(201).json({
                message: "Product added successfully",
                data: product
            });

        } catch (error: any) {

            console.error("Database insert failed:", error);

            if (req.file) {

                const imagePath = path.resolve(
                    "uploads",
                    req.file.filename
                );

                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            return res.status(500).json({
                message: "Failed to add product",
                error: error.message
            });
        }
    });
};



const getAllProductLinks = async (req: Request, res: Response) => {

    try {

        const products = await ProductLink.findAll({
            order: [
                ["createdAt", "DESC"]
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Product links fetched successfully",
            count: products.length,
            data: products
        });

    } catch (error: any) {

        console.error("Get product links error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch product links",
            error: error.message
        });
    }
};

export {
    addProductLink,
    getAllProductLinks
};