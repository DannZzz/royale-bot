import { GuildMember, Interaction, Message } from "discord.js";
import Models from "../database/db";
import { _SlashCommandChest } from "../handler";
import Chest from "../typing/Chest";
import EmbedConstructor from "../typing/Embed-Constructor";
import Event from "../typing/Event";
import SlashCommand from "../typing/SlashCommand";
export const cooldowns = new Chest<string, Chest<string, number>>()

export default new Event({
    name: "interactionCreate",
    async callback(client, interaction) {
        if (interaction.isCommand()) {
            const command = _SlashCommandChest.get(interaction.commandName);
            if (!command || command.disabled) return;
            const cd = cooldown(command, interaction);
            if (cd) return;
            const guild = await (new Models("Guild")).findOrCreate(interaction.guildId);
            const user = await (new Models("User")).findOrCreate(interaction.user.id);
            if (command.staffOnly && !(interaction.member as GuildMember).roles.cache.hasAny(...(guild.staff || []))) return interaction.reply({content: "Эта команда не доступна вам!", ephemeral: true});
            command.execute({interaction, thisGuild: guild, thisUser: user, client, command: interaction.commandName, Embed: new EmbedConstructor({main: client.colors.main, error: client.colors.error, success: client.colors.success}), options: interaction.options})
        }
    }
})

function cooldown (commandfile: SlashCommand, interaction: Interaction) {
    if (!cooldowns.has(commandfile.uniqueName)) {
        cooldowns.set(commandfile.uniqueName, new Chest());
    }

    const currentTime = Date.now();
    const time_stamps = cooldowns.get(commandfile.uniqueName);
    const cooldownAmount = (commandfile.cooldown || 1.5) * 1000;

    var toReturn: number;
    
    if (time_stamps.has(interaction.user.id)) {
        const expire = time_stamps.get(interaction.user.id) + cooldownAmount;
        if (currentTime < expire) {
            const time = (expire - currentTime) / 1000;

            toReturn = time;
        } else {
            time_stamps.set(interaction.user.id, currentTime);
            setTimeout(() => time_stamps.delete(interaction.user.id), cooldownAmount);
            toReturn = null;
        }
    } else {
        time_stamps.set(interaction.user.id, currentTime);
        setTimeout(() => time_stamps.delete(interaction.user.id), cooldownAmount);
    }
    return toReturn;
}
