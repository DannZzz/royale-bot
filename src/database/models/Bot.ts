import mongoose from "mongoose";
import { ShopItem } from "../../docs/ages/Shop";

export interface Bot {
    /**
     * Data id (name)
     */
    _id: string;
    /**
     * Last checked time
     */
    lastTime?: Date;
    /**
     * This items for shop
     */
    shopItems: ShopItem[];
}

export const Bot = mongoose.model('bot', new mongoose.Schema<Bot>({
    _id: String,
    lastTime: { type: Date, default: null },
    shopItems: { type: Array as any, default: [] }
}))