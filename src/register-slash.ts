import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { CLIENT_ID, PRIVATE_SERVER_DEV, TOKEN } from "./config";
import { _SlashCommandChest } from "./handler";

export async function registerSlashCommands () {
    const commands = [..._SlashCommandChest].map(([s, k]) => k);

    const rest = new REST({version: "10"}).setToken(TOKEN);
    
    
    if (!PRIVATE_SERVER_DEV) {
        rest.put(Routes.applicationCommands(CLIENT_ID), {body: commands.map(x => x.data.toJSON())})
            .then(() => console.log("Successfully registered application commands."))
            .catch(console.error)
    } else {
        rest.put(Routes.applicationGuildCommands(CLIENT_ID, PRIVATE_SERVER_DEV), {body: commands.map(x => x.data.toJSON())})
            .then(() => console.log("Successfully registered application commands to the server."))
            .catch(console.error)
    }    
}

