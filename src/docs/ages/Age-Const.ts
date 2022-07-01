import { APIApplicationCommandOptionChoice } from "discord-api-types/v10";
import { EmojiResolvable } from "discord.js";
import Currency from "../currency/Currency";

export enum AgeNamesEnum {
    Classic = "Классическая"
}

export type BuyOption = {
    unvailable?: boolean;
} & {
    type: keyof Currency['types'],
    amount: number
}

export type AgeNames = keyof typeof AgeNamesEnum;
export type AgeItemType = "attack" | "buff"
export type GameTaskMethodsTyping = "buffTaking" | "walking" | "selfKilling" | "killing";
export const GameTaksMethodsArray: GameTaskMethodsTyping[] = ["buffTaking", 'killing', "selfKilling", 'walking'];

export interface AgeItem {
    type: AgeItemType;
    uniqueString: string;
    name: string;
    bonus: number;
    emoji: EmojiResolvable
    // buying: {
    //     unvailable: boolean;
    // } | {
    //     type: keyof Currency['types'],
    //     amount: number
    // }
}

export class Age {
    name: AgeNames;
    emoji: EmojiResolvable;
    items: AgeItem[];
    iconLink: string;
    moneyFromUser: number;
    moneyForKill: number;
    moneyType: keyof Currency['types'];
    jsonText:  {killing: string[], buffTaking: string[], walking: string[], selfKilling: string[]}
    toString() {
        return `${this.emoji} **${AgeNamesEnum[this.name as any]}**`
    }
    constructor (options: Age) {
        Object.assign(this, options);
    }
}

export function AgesAsChoices (): APIApplicationCommandOptionChoice<string>[] {
    const arr = [];

    for (let i in AgeNamesEnum) {
        arr.push({name: AgeNamesEnum[i], value: i});
    }
    return arr;
}