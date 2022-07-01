import { Client } from "client-discord";
import { Message, PermissionResolvable } from "discord.js";
import { Guild } from "../database/models/Guild";
import { User } from "../database/models/User";
import EmbedConstructor from "./Embed-Constructor";

interface MessageCommandExecuteArguments {
    /**
     * This client
     * @type {Client}
     */
    client: Client;
    /**
     * Sent message
     * @type {Message}
     */
    msg: Message;
    /**
     * This used command
     * @type {string}
     */
    command: string;
    /**
     * Message content args
     * @type {string[]}
     */
    args: string[];
    /**
     * This Guild data in database
     * @type {Guild}
     */
    thisGuild: Guild;
    /**
     * This prefix
     * @type {string}
     */
    usedPrefix: string;
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


export default class MessageCommand {
    /**
     * main name
     */
    name: string;
    /**
     * description
     */
    description?: string;
    /**
     * Cooldown time in seconds
     */
    cooldown?: number;
    permissions?: PermissionResolvable;
    devOnly?: boolean;
    hideInHelp?: boolean;
    aliases?: string[];
    disabled?: boolean;
    execute: (options: MessageCommandExecuteArguments) => Promise<any>
    constructor(options: MessageCommand) {
        Object.assign(this, options);
    }
}