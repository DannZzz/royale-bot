import { SlashCommandBuilder } from "@discordjs/builders";
import { PermissionFlagsBits } from "discord-api-types/v10";
import SlashCommand from "../../typing/SlashCommand";

export default new SlashCommand ({
    uniqueName: "change-user-bot",
    data: new SlashCommandBuilder ()
.setDMPermission(false)
        .setName('change-user-bot')
        
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('Changes bots username and avatar')
        .addStringOption(o => o
            .setName("username")
            .setDescription('bots username'))
        .addAttachmentOption(o => o
            .setName('avatar')
            .setDescription('bots avatar')),
    async execute ({interaction, options, client}) {
        const username = options.getString('username');
        const avatar = options.getAttachment('avatar');

        if (!username && !avatar) return interaction.reply({content: "U need to specify almost one parameter", ephemeral: true});

        try {
            if (username) client.user.setUsername(username);
            if (avatar) client.user.setAvatar(avatar.url || avatar.proxyURL);

            return interaction.reply({content: "Successfully changed", ephemeral: true});
        } catch (e) {
            return interaction.reply({content: `Error: **${e.message}**`, ephemeral: true})
        }
    }
})