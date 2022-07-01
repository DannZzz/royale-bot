import { Util } from "client-discord";
import { ClassicAge } from "../../ages/ages-data/Classic/Classic";
import { Pack } from "../Packs-const";

export const ClassicAgePack = new Pack ({
    ageOrName: "Classic",
    isAgePack: true,
    emoji: ClassicAge.emoji,
    reward: {itemList: "Classic", amount: () => Util.random(1, 5), type: 'primary'},
    cost: {
        type: "secondary",
        amount: 10_000
    }
})
