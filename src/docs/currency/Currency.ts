import { EmojiResolvable } from "discord.js"
import { User } from "../../database/models/User";

type CurrencyOptions = {
    emoji: EmojiResolvable;
}

interface CurrencyTypes {
    primary: CurrencyOptions;
    secondary: CurrencyOptions;
}

export default class Currency {
    readonly types: CurrencyTypes = {
        primary: {
            emoji: "<:gem:989471023801966602>"
        },
        secondary: {
            emoji: "<:gold:989471026687664138>"
        }
    }

    static get types () {
        return new this().types;
    }

    /**
     * Use toString() to get perfect money interaface
     * 
     * @param user user data
     * @returns array ot string
     */
    static createMoneyInterface (user: User): string[] {
        const money = [];
        let cur: keyof Currency["types"];
        for ((cur as any) in Currency.types) {
            if (cur in user) money.push(
                `**${cur === "primary" ? "Гемы" : "Золото"}**: ${Currency.types[cur].emoji} \` ${this.formatNumber(user[cur])} \``
            );
        }
    
        money.toString = () => money.join("\n");
        return money;
    }

    /**
    * Formats number
    * 
    * @param number any number 6551484
    * @returns 6 551 484;
    */
    static formatNumber(number: number | string) {
        number += "";
        let fm = (number as string).split('').reverse().join('').replace(/([0-9]{3})/g, "$1 ").split('').reverse().join('');
        if (fm[0] === " ") fm = fm.slice(1);
        return fm;
    }
}
