import { ModalBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { stripIndents } from "common-tags";
import { PermissionFlagsBits } from "discord-api-types/v10";
import { Interaction, MessageActionRow, MessageButton } from "discord.js";
import SlashCommand from "../../typing/SlashCommand";

export default new SlashCommand({
    uniqueName: "send-verify-message",
    data: new SlashCommandBuilder()
        
        .setName("set-status")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription("set new status for bot")
        .addStringOption(o => o
            .setName("status")
            .setDescription("сделать новый статус")
        ) as any,
    async execute({client, options, interaction}) {
        const status = options.getString("status");
        client.user.setActivity({type: "STREAMING", name: status})
        interaction.reply({content: "okk...", ephemeral: true})
    }
        
})