import { Age } from "../../Age-Const";
import killing from "./texts/killing.json";
import selfKilling from "./texts/selfKilling.json";
import buffTaking from "./texts/buffTaking.json";
import walking from "./texts/walking.json";

export const ClassicAge = new Age ({
    name: "Classic",
    emoji: "<:classicAge:989625303850709062>",
    moneyForKill: 4,
    moneyFromUser: 200,
    moneyType: "secondary",
    iconLink: "https://cdn.discordapp.com/emojis/989625303850709062.webp?size=2048",
    jsonText: {
        killing,
        selfKilling,
        buffTaking,
        walking,
    },
    items: [
        {
            bonus: 2,
            emoji: "<:pirateshand:922115741057187880>",
            name: "Мачете",
            uniqueString: "machette-classic",
            type: "attack"
        },
        {
            bonus: 5,
            emoji: "<:arabiandance:922115741526941716>",
            name: "Двойное мачете",
            uniqueString: 'double-machette-classic',
            type: "attack"
        },
        {
            bonus: 1,
            emoji: "<:bow:920988161855852605>",
            name: "Лук",
            uniqueString: "default-bow-classic",
            type: "attack"
        },
        {
            bonus: 3,
            emoji: "<:soulkiller:920988163596496917>",
            name: "Аметистовый Лук",
            uniqueString: "amethyst-bow-classic",
            type: "attack"
        },
        {
            bonus: 5,
            emoji: "<:naturehunter:920988163596496916>",
            name: "Эмеральдовый Арбалет",
            uniqueString: "emerald-crossbow-classic",
            type: "attack"
        },
        {
            bonus: 3,
            emoji: "<:longsword:992359427367776287>",
            name: "Длинный меч",
            uniqueString: "long-sword-classic",
            type: "attack"
        },
        {
            bonus: 2,
            emoji: "<:barbarianshield:922122344422588447>",
            name: "Щит Варвара",
            uniqueString: 'barbarian-shield-classic',
            type: 'attack'
        },
        {
            bonus: 3,
            emoji: '<:rockshield:922122344510677022>',
            name: "Каменный Щит",
            uniqueString: "stone-shield-classic",
            type: 'attack'
        },
        {
            bonus: 5,
            emoji: "<:vikingsshield:922122344443576340>",
            name: "Щит Викинга",
            uniqueString: "viking-shield-classic",
            type: 'attack'
        },
        {
            bonus: 6,
            emoji: '<:snowdown:920988162396946492>',
            name: "Снежный Лук",
            uniqueString: "snow-bow-classic",
            type: 'attack'
        }
    ]
});