import { SlashCommandBuilder } from "@discordjs/builders";
import { PermissionFlagsBits } from "discord-api-types/v10";
import Models from "../../database/db";
import SlashCommand from "../../typing/SlashCommand";

export default new SlashCommand ({
    uniqueName: "staff-role-changing",
    data: new SlashCommandBuilder()
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setName('staff-team')
        .setDescription("Change or Get staff team")
        .addRoleOption(o => o
            .setName("role")
            .setDescription('Change role')),
    async execute ({thisGuild, interaction, options, Embed, client}){
        const role = options.getRole('role');

        if (!role) return Embed.setTitle("Staff roles").setText(`${thisGuild.staff?.map(x => {if (interaction.guild.roles.cache.has(x)) return `<@&${x}>`}).join("\n")}`).interactionReply(interaction, {ephemeral: true});
        const roles = thisGuild.staff || [];
        const guilds = new Models('Guild').model
        if (roles.includes(role.id)) {
            await guilds.updateOne({_id: interaction.guildId}, {$set: {staff: client.util.remove(roles, {elements: [role.id], indexes: []})}});
            return interaction.reply({content: `${role} успешно убран из списка!`, ephemeral: true});
        } else {
            await guilds.updateOne({_id: interaction.guildId}, {$push: {staff: role.id}});
            return interaction.reply({content: `${role} успешно добавлена в список!`, ephemeral: true});
        }
    }
})