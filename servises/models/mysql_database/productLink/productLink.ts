import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database";
import { ProductLinkAttributes, ProductLinkCreationAttributes } from "../../../interfaces/productLink";

class ProductLink extends Model<ProductLinkAttributes, ProductLinkCreationAttributes> { }

ProductLink.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        main_category: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },

        link: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelize,
        tableName: "product_links",
        timestamps: true,
    }
);

export default ProductLink;