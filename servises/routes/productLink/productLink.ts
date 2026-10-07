import express from "express";
import { addProductLink, getAllProductLinks } from "../../controller/productLink/productLink";

const route = express.Router();

route.post("/product/link", addProductLink);

route.get("/product/link", getAllProductLinks);

export default route;