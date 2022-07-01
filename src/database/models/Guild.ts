import { ChannelResolvable } from "discord.js";
import mongoose from "mongoose";
import { DEFAULT_PREFIX } from "../../config";
type ChannelId = string;
type RoleId = string;

export interface Guild {
    /**
     * Guild's id
     */
    _id: string;
    /**
     * Command permissions
     */
    commands?: {[k: string]: {disabledChannels: ChannelId[]}}
    /**
     * Server's prefix
     */
    prefix?: string
    /**
     * Who can start game
     */
    staff?: RoleId[];
}

export const Guild = mongoose.model("guild", new mongoose.Schema<Guild>({
    _id: String,
    prefix: { type: String, default: DEFAULT_PREFIX },
    commands: { type: Object, default: {} },
    staff: { type: Array as any, default: [] },
}))