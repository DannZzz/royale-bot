import mongoose from "mongoose";
import { AgeNames } from "../../docs/ages/Age-Const";
import Currency from "../../docs/currency/Currency";
import { PackNames } from "../../docs/packs/Packs-const";

type CooldownTypes = "daily" | "weekly";

export type ItemData = {item: string, isPicked: boolean};

export interface User {
    /**
     * User's discord id
     */
    _id: string;
    /**
     * custom nickname 
     */
    nickname?: string;
    /**
     * User's games won count
     */
    wins: number;
    /**
     * Games count
     */
    gamesPlayed: number;
    /**
     * Hosted games count
     */
    gamesHosted: number;
    /**
     * Total Kills count
     */
    kills: number;
    /**
     * Primary money
     * @type {keyof Currency}
     */
    primary?: number;
    /**
     * Secondary money
     * @type {keyof Currency}
     */
    secondary?: number;
    /**
     * ? Is user blocked by admins
     */
    isBlocked?: boolean;
    /**
     * Global cooldowns
     */
    cooldowns?: {[k in CooldownTypes]?: Date};
    /** 
     * age items
     */
    ages?: Partial<{[k in AgeNames]: Array<ItemData>}>
    /**
     * Packs
     */
    packs?: Partial<{[k in PackNames]: number}>
}

export const User = mongoose.model("user", new mongoose.Schema<User>({
    _id: String,
    nickname: { type: String, default: null },
    gamesPlayed: { type: Number, default: 0 },
    gamesHosted: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    kills: { type: Number, default: 0 },
    primary: { type: Number, default: 0 },
    secondary: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
    cooldowns: { type: Object, default: {} },
    ages: { type: Object, default: {} },
    packs: { type: Object, default: {} },
}))