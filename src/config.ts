import { EmojiIdentifierResolvable, ColorResolvable } from "discord.js";
import Currency from "./docs/currency/Currency";

export const TOKEN = processOr("TOKEN", "OTU3NjA5MDM1NTM5MDMwMDY2.G4HxuF.m45FcC2T6Q_SwKbUFtGJ7ysKzsZooPbmIrQ4jA");
export const MONGO = processOr("MONGO", "mongodb+srv://DannTest:099075020@botdiscord.hkvvx.mongodb.net/RoyaleBot");
export const CLIENT_ID = processOr("CLIENT_ID", "957609035539030066");
export const DEV_ID = "382906068319076372";
export const PRIVATE_SERVER_DEV = processOr("PRIVATE_SERVER_DEV", "839462072970641419");
export const DEFAULT_PREFIX = processOr("DEFAULT_PREFIX", "!");
export const PAGINATION_EMOJIS = ["⏪", "<:left:925716528689721384>", "<:right:925716528916213790>", "⏩"];

export const DEFAULT_PRIMARY: number = 50;

export const GAME_JOIN_EMOJI: EmojiIdentifierResolvable = "🚪";

export const SHOP_RANDOM_ITEMS_LIMIT: number = 5;

export const EMOJIS = {
    success: '<:checked:926005208335663124>',
    error: "<:cancel1:926005208176271422>",
    rip: "<:rip:992115436290314240>",
    kill: "<:kill:992116190954668102>",
    selfKill: "<:selfkill:992116585848373249>",
    healing: "<:healing:992117215224664166>"
}

export const OneDay: number = 86400000;

export const ExtraPrimaryWhileItemAlreadyExists: number = 5;

export const REWARD: {[k in "daily" | "weekly"]: {type: keyof Currency['types'], amount: number}} = {
    daily: {
        type: 'secondary',
        amount: 1500
    },
    weekly: {
        type: 'secondary',
        amount: 10000
    }
}

export const PICKED_ITEMS_LIMIT: number = 6

export const colors: {[k in "main" | "error" | "success"]: ColorResolvable} = {main: "DARK_GOLD", error: "DARK_RED", success: "DARK_GREEN"}

function processOr(key: string, defaultValue: any): string {
    return process.env[key] || defaultValue;
}