import { ItemData } from "../../database/models/User";
import Currency from "../currency/Currency";
import { Age, AgeItem, AgeNames } from "./Age-Const";
import { ClassicAge } from "./ages-data/Classic/Classic";
import Shop, { ShopItem } from "./Shop";

export default class Ages {
    static readonly data: Age[] = [
        ClassicAge
    ]; 
    /**
     * Get age data by name
     * 
     * @param ageName age name
     * @returns {Age}
     */
    static getAge (ageName: AgeNames): Age {
        return this.data.find(x => x.name === ageName)
    }

    /**
     * Get all ages items;
     */
    static getItems(): AgeItem[];
    /**
     * Get all items from spec. age
     * 
     * @param age age name
     */
    static getItems(age: AgeNames): AgeItem[];
    static getItems(age: AgeNames, type: "force"): (AgeItem | ShopItem)[];
    static getItems(age?: AgeNames, type?: "force"): AgeItem[] | (AgeItem | ShopItem)[] {
        let toSend: Array<any> = null;
        if (age) {
            const ageData = this.getAge(age);
            if (!ageData) return toSend;
            toSend = ageData.items;
            if (type === "force") Shop.items.forEach(it => { 
                if (it.age === age) toSend.push(it)
            })
        } else {
            toSend = this.data.reduce((arr, age) => arr.concat(age.items), [])
            if (type === "force") toSend = toSend.concat(Shop.items);
        }
        
        return toSend;
    }

    /**
     * Find item by russian name
     * 
     * @param itemName item name RU
     */
    static findItemByName (itemName: string): AgeItem;
    /**
     * Find item by russian name, but more faster
     * 
     * @param itemName item name RU
     * @param age item's age
     */
    static findItemByName (itemName: string, age: AgeNames): AgeItem;
    static findItemByName (itemName: string, age?: AgeNames): AgeItem {
        return this.getItems(age).find(x => x.name.toLowerCase() === itemName.toLowerCase());
    }

    /**
     * Item to string
     * 
     * @param items items's array
     * @returns names strings's array
     */
    static visulate (items: AgeItem[]) {
        return items.map(x => `${x.emoji} \`${x.name}\` - \` ${Currency.formatNumber(x.bonus)} \``)
    }

    /**
     * Checking and getting item
     * 
     * @param itemList age item list
     * @param itemUniqueName item name unique
     * @returns item or null 
     */
    static hasItem (itemList: ItemData[], itemUniqueName: string) {
        return itemList.find(it => it.item === itemUniqueName) || null;
    }
}
