import { SlashCommandBuilder } from "@discordjs/builders";
import { PermissionFlagsBits } from "discord-api-types/v10";
import { changeMoney } from "../../database/db";
import Currency from "../../docs/currency/Currency";
import SlashCommand from "../../typing/SlashCommand";

export default new SlashCommand ({
    uniqueName: "changeMoney",
    data: new SlashCommandBuilder()
        .setName("change-money")
        .setDescription("Change user's money")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        
        .addUserOption(o => o
            .setName("user")
            .setDescription("User's data to change")
            .setRequired(true))
        .addNumberOption(o => o
            .setName("amount")
            .setDescription("Money to change to")
            .setRequired(true))
        .addStringOption(o => o
            .setName("money-type")
            .setDescription("Money's tipe to change")
            .setRequired(true)
            .addChoices({name: "Primary currency", value: "primary"}, {name: "Secondary currency", value: "secondary"})),
    async execute ({interaction, options, Embed}) {
        const user = options.getUser('user');
        const amount = options.getNumber('amount');
        const type = options.getString('money-type');

        await changeMoney(user.id, amount, type as any);
        
        Embed
            .setSuccess(`Успешно добавлено ${Currency.types[type as any].emoji} \` ${Currency.formatNumber(amount)} \` участнику **${user.username}**`).interactionReply(interaction);
    }
})