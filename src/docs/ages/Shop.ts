import { SHOP_RANDOM_ITEMS_LIMIT } from "../../config";
import { randomItem } from "../../typing/Games";
import { AgeItem, AgeNames, BuyOption } from "./Age-Const";

export type ShopItem = AgeItem & {age: AgeNames, buying: BuyOption};

export default class Shop {
    static readonly items: ShopItem[] = [
        {
            name: "Арбалет",
            uniqueString: "crossbow-classic",
            bonus: 4,
            emoji: "<:crossbow:990185814472417310>",
            type: "attack",
            age: 'Classic',
            buying: {
                type: 'primary',
                amount: 75
            }
        },
        {
            name: "Катана",
            uniqueString: "katana-classic",
            bonus: 5,
            type: "attack",
            age: "Classic",
            buying: {
                type: 'primary',
                amount: 75
            },
            emoji: '<:katana:990187949771599893>'
        },
        {
            name: "Кинжал",
            uniqueString: 'kinjal-classic',
            type: 'attack',
            age: 'Classic',
            bonus: 4,
            buying: {
                type: "primary",
                amount: 75
            },
            emoji: '<:kinjal:990188614577176617>'
        },
        {
            name: "Алмазный Меч",
            uniqueString: 'diamond-sword-classic',
            age: 'Classic',
            bonus: 7,
            emoji: '<:diamondsword:992359804980973568>',
            buying: {
                type: 'primary',
                amount: 150
            },
            type: 'attack'
        },
        {
            name: "Алмазное Кольцо",
            uniqueString: 'diamond-ring-classic',
            age: "Classic",
            bonus: 8,
            emoji: '<:diamondring:992360156362977280>',
            buying: {
                type: 'primary',
                amount: 200
            },
            type: 'buff'
        },
        {
            name: "Аметистовый Меч",
            uniqueString: "amethyst-sword-classic",
            age: 'Classic',
            bonus: 8,
            emoji: "<:amethystsword:992361744980779098>",
            buying: {
                type: 'primary',
                amount: 200
            },
            type: 'attack'
        },
        {
            name: "Меч Дракона",
            uniqueString: 'dragon-sword-classic',
            age: "Classic",
            bonus: 10,
            emoji: "<:dragonsword:992360280820547604>",
            buying: {
                type: 'primary',
                amount: 250
            },
            type: 'attack'
        },
        {
            name: "Огненный Лук",
            uniqueString: "fire-bow-classic",
            age: 'Classic',
            bonus: 5,
            buying: {
                type: 'primary',
                amount: 100
            },
            type: 'attack',
            emoji: '<:fireminder:920988161851658292>'
        },
        {
            name: "Аметистовый Арбалет",
            uniqueString: 'amethyst-crossbow-classic',
            emoji: '<:soulking:920988162388529162>',
            bonus: 6,
            buying: {
                type: 'primary',
                amount: 150
            },
            type: 'attack',
            age: 'Classic'
        },
        {
            name: "Арбалет Вампира",
            uniqueString: "vampire-crossbow-classic",
            emoji: '<:vampireweapon:920988162229153822>',
            bonus: 8,
            buying: {
                type: 'primary',
                amount: 200
            },
            age: 'Classic',
            type: 'attack'
        }
    ];

    static randomItems (limit: number = SHOP_RANDOM_ITEMS_LIMIT): ShopItem[] {
        if (limit >= this.items.length) return this.items;
        var arr = [];
        for (let i = 0; i < limit; i++) {
            let item = randomItem(this.items);
            while (arr.includes(item)) item = randomItem(this.items);
            arr.push(item);
        }
        return arr;
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
         return this.items.filter(x => age ? age === x.age : true).find(x => x.name.toLowerCase() === itemName.toLowerCase());
     }
    
}
