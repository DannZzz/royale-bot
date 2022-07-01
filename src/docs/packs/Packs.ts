import { AgeNames, AgeNamesEnum } from "../ages/Age-Const";
import Currency from "../currency/Currency";
import { ClassicAgePack } from "./list/classicAgePack";
import { Pack, PackNames, PackNamesEnum } from "./Packs-const";

export default class Packs {
    static readonly data: Pack[] = [
        ClassicAgePack
    ]

    /**
     * Get all packs
     */
    static getPacks(): Pack[];
    /**
     * Get pack with custom name
     * 
     * @param name pack custom name
     */
    static getPacks(name: PackNames): Pack;
    static getPacks(ageOrName?: string | AgeNames): Pack | Pack[] {
        let toSend = null;
        if (ageOrName) {
            const pack = this.data.find(p => p.ageOrName === ageOrName);
            if (!pack) return toSend;
            toSend = pack;
            return toSend;
        } else {
            return this.data;
        }
    }

    /**
     * Finds pack by visual name
     * 
     * @param packName pack name RU
     * @returns Pack
     */
    static findPackByName (packName: string): Pack {
        return this.data.find(p => PackNamesEnum[p.ageOrName].toLowerCase() === packName.toLowerCase());
    }

    /**
     * Packs to arrays of string
     * 
     * @param packs packs from user document
     * @returns 
     */
    static visaulate(packs: { [k in PackNames]?: number }): {agePacks: string[], customPacks: string[], all: string[]} {
        const agePackStrings = [];
        const customPackStrings = [];
        for (let packName in packs) {
            if (packs[packName] <= 0) continue;
            const pack = this.getPacks(packName as any);
            if (!pack) return null;
            const text = `**${PackNamesEnum[pack.ageOrName]}**: ${pack.emoji} \` ${Currency.formatNumber(Math.round(packs[packName]))} \``;
            if (AgeNamesEnum[pack.ageOrName]) { 
                agePackStrings.push(text)
            } else {
                customPackStrings.push(text)
            }
        }
        
        return {
            all: agePackStrings.concat(customPackStrings),
            agePacks: agePackStrings,
            customPacks: customPackStrings
        }

    }

}
