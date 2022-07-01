import { SlashCommandBuilder } from "@discordjs/builders";
import { PermissionFlagsBits } from "discord-api-types/v10";
import SlashCommand from "../../typing/SlashCommand";

export default new SlashCommand ({
    uniqueName: "adding-emojies",
    data: new SlashCommandBuilder()
        .setName("add-emoji")
        .setDescription("adding new emoji to the server")
        
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEmojisAndStickers)
        .addStringOption(o => o
            .setName("name")
            .setDescription("emoji name")
            .setRequired(true))
        .addAttachmentOption(o => o
            .setName("image")
            .setDescription("emoji image")
            .setRequired(true)),
    async execute ({interaction, options}) {
        const name = options.getString("name");
        const attachment = options.getAttachment("image");

        try {
            const emoji = await interaction.guild.emojis.create(attachment.url || attachment.proxyURL, name);
            return interaction.reply({content: `Successfully created ${emoji} \`<:${emoji.identifier}>\``})
        } catch (e) {
            interaction.reply({content: e?.message || "error", ephemeral: true})
        }
    }
})