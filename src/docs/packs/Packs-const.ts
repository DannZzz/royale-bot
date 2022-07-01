import { EmojiResolvable } from "discord.js";
import { AgeNames } from "../ages/Age-Const";
import Currency from "../currency/Currency";

export enum PackNamesEnum {
    Classic = "Классический Пак"
}

export type PackNames = keyof typeof PackNamesEnum;

export class Pack {
    ageOrName: PackNames;
    emoji: EmojiResolvable;
    isAgePack?: boolean;
    reward: {
        type?: keyof Currency["types"];
        amount?: number | (() => number);
        itemList?: AgeNames;
    };
    cost: {
        type: keyof Currency['types'];
        amount: number
    }

    toString() {
        return `${this.emoji} **${PackNamesEnum[this.ageOrName]}**`
    }

    constructor(options: Pack) {
        Object.assign(this, options)
    }
}

