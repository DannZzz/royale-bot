import { SlashCommandBuilder } from "@discordjs/builders";
import { PermissionFlagsBits } from "discord-api-types/v10";
import { EverydayChest } from "../..";
import SlashCommand from "../../typing/SlashCommand";

export default new SlashCommand ({
    uniqueName: "refresh-shop",
    data: new SlashCommandBuilder ()
.setDMPermission(false)
        .setName('refresh-shop')
        
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('refreshs shop items'),
    async execute ({interaction}) {
        const shop = EverydayChest.get('shopRefresh');
        await shop.doNow();
        interaction.reply({content: 'Successfully refreshed!', ephemeral: true});
    }
})