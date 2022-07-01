import { Client } from "client-discord";
import path from "path";
import fs from "fs";
import { Chest } from "./typing/Chest";
import SlashCommand from "./typing/SlashCommand";
import Event from "./typing/Event";
import { MONGO } from "./config";
import { connect } from "mongoose";
export const indexDir = __dirname;
// Chests commands and events
export const _SlashCommandChest = new Chest<string, SlashCommand>();
export default async function (client: Client) {
    if (!MONGO) throw new Error("Mongo db uri not found");
    connect(MONGO).then(() => console.log("Mongo was successfully connected"))
    
    // handling slash commands
    async function getMessageCommands() {
        fs.readdirSync(path.join(__dirname, "slash-commands/")).forEach(async dir => {
            const commands = fs.readdirSync(path.join(__dirname, "slash-commands/" + dir)).filter(f => f.endsWith(".js") || f.endsWith(".ts"));

            for (let command of commands) {
                const file = await importFile(path.join(__dirname, `slash-commands/${dir}/${command}`)) as SlashCommand;
                if (!file.disabled) {
                    _SlashCommandChest.set(file.data.name, file);
                    console.log(`Command '${file.data.toJSON().name}' was loaded!`)
                }
            }
        });

    }


    // handling events 
    async function getEvents() {
        const events = fs.readdirSync(path.join(__dirname, "events/")).filter(f => f.endsWith(".js") || f.endsWith(".ts"));

        for (let event of events) {
            const file = await importFile(path.join(__dirname, `events/${event}`)) as Event<any>;
            if (!file.disabled) client.on(file.name, (m) => file.callback(client, m));
        }
    }

    await Promise.all([
        getMessageCommands(),
        getEvents()
    ]).then(() => {
        client.login();
    })
}

/**
     * ! imports a file with import() async function
     * 
     * @param url url of file
     * @returns file
     */
export async function importFile(url: string) {
    return (await import(url))?.default;
}
