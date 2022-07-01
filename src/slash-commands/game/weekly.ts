import { SlashCommandBuilder } from "@discordjs/builders";
import { OneDay, REWARD } from "../../config";
import Models, { changeMoney } from "../../database/db";
import Currency from "../../docs/currency/Currency";
import { DateTime } from "../../typing/DateAndTime";
import SlashCommand from "../../typing/SlashCommand";

export default new SlashCommand({
    uniqueName: "weekly-reward",
    data: new SlashCommandBuilder()
        .setDMPermission(false)
        .setName("еженедельная-награда")
        .setDescription("Получить еженедельную награду")
    ,
    cooldown: 5,
    async execute({ options, interaction, thisUser, Embed }) {
        if (thisUser.cooldowns.weekly && thisUser.cooldowns.weekly >= new Date()) return Embed.setError(`Попробуй ещё раз через ${DateTime.formatTime(DateTime.getTimeData(thisUser.cooldowns.weekly.getTime()))}.`).interactionReply(interaction);

        await Promise.all([
            changeMoney(interaction.user.id, REWARD.weekly.amount, REWARD.weekly.type),
            new Models('User').model.updateOne({ _id: interaction.user.id }, { $set: { "cooldowns.weekly": new Date(Date.now() + (OneDay * 7)) } })
        ])

        Embed
            .setTitle("Еженедельная Награда")
            .setText(`Вы получаете ${Currency.types[REWARD.weekly.type].emoji} ${Currency.formatNumber(REWARD.weekly.amount)}.`)
            .setColor('AQUA')
            .interactionReply(interaction)
    }
})