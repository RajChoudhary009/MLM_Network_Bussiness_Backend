import mongoose, { Schema, Types } from "mongoose";

import { IAddress } from "../../../interfaces/user";

const addressSchema = new Schema<IAddress>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        house: {
            type: String,
            default: ""
        },
        street: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        state: {
            type: String,
            default: ""
        },
        pincode: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

export const Address = mongoose.model<IAddress>("Address", addressSchema);