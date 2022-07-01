import { Client } from "client-discord"
import { TOKEN, colors } from "./config"
import Models from "./database/db"
import Shop from "./docs/ages/Shop"
import handler from "./handler"
import { registerSlashCommands } from "./register-slash"
import Chest from "./typing/Chest"
import { Everyday } from "./typing/Everyday"

export const EverydayChest = new Chest<'shopRefresh', Everyday>();

const client = new Client ({token: TOKEN, intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"], colors})
handler(client).then(async () => {
    const bots = new Models('Bot');
    const main = await bots.findOrCreate("main");

    const ev = new Everyday()
    .setCheckTime("00")
    .setDate(main.lastTime || new Date(Date.now() - 85000000))
    .setTimeZone("ru-ru", {timeZone: "Europe/Moscow"})
    .setUpdateBase(async (date) => await bots.model.updateOne({_id: "main"}, {$set: {lastTime: date}}))
    .setOneTimeInDay(async () => {
        const items = Shop.randomItems(5);
        await bots.model.updateOne({_id: "main"}, {$set: {shopItems: items}});
    })
    .start();

    EverydayChest.set('shopRefresh', ev);
    
    registerSlashCommands()
})

client.on("error", (err) => console.log("Discord Error\n", err))
process.on("unhandledRejection", (er) => console.log("Unhandled Rejection\n", er))


