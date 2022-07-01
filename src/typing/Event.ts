import { Client } from "client-discord";
import { ClientEvents } from "discord.js";

export default class Event <T extends keyof ClientEvents> {
    name: T;
    disabled?: boolean;
    callback: (client: Client, ...args: ClientEvents[T]) => any;

    constructor(options: Event<T>) {
        Object.assign(this, options)
    }
}