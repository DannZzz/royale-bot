import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { Client } from "client-discord";
import { PermissionFlagsBits } from "discord-api-types/v10";
import { CommandInteraction, Interaction, PermissionResolvable } from "discord.js";
import { Guild } from "../database/models/Guild";
import { User } from "../database/models/User";
import EmbedConstructor from "./Embed-Constructor";

export default class SlashCommand {
    /**
     * Unique name for command DEV
     */
    uniqueName: string;
    /**
     * Main Command Data
     */
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    /**
     * Cooldown in seconds;
     */
    cooldown?: number;
    /**
     * Is command made only for developer
     */
    devOnly?: boolean;
    /**
     * Would command be hidden in help command list
     */
    hideInHelp?: boolean;
    /**
     * Is command disabled
     */
    disabled?: boolean;
    /**
     * Is command usable only for staff members
     */
    staffOnly?: boolean;
    /**
     * Execute function
     */
    execute: (options: InteractionCommandExecuteArguments) => Promise<any>;
    constructor(options: SlashCommand) {
        Object.assign(this, options)
    }
}

interface InteractionCommandExecuteArguments {
    /**
     * This client
     * @type {Client}
     */
    client: Client;
    /**
     * Sent Interaction
     * @type {Interaction}
     */
    interaction: CommandInteraction;
    /**
     * This used command
     * @type {string}
     */
    command: string;
    /**
     * Message content args
     * @type {string[]}
     */
    options: CommandInteraction["options"];
    /**
     * This Guild data in database
     * @type {Guild}
     */
    thisGuild: Guild;
    /**
     * This User data in database
     * @type {User}
     */
    thisUser: User;
    /**
     * Embed Constructor
     * @type {EmbedConstructor} 
     */
    Embed: EmbedConstructor;
}

