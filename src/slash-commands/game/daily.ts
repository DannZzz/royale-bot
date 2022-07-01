import { SlashCommandBuilder } from "@discordjs/builders";
import { OneDay, REWARD } from "../../config";
import Models, { changeMoney } from "../../database/db";
import Currency from "../../docs/currency/Currency";
import { DateTime } from "../../typing/DateAndTime";
import SlashCommand from "../../typing/SlashCommand";

export default new SlashCommand ({
    uniqueName: "daily-reward",
    data: new SlashCommandBuilder ()
        .setDMPermission(false)
        .setName("ежедневная-награда")
        .setDescription("Получить ежедневную награду")
        ,
    cooldown: 5,
    async execute({options, interaction, thisUser, Embed}) {
        if (thisUser.cooldowns.daily && thisUser.cooldowns.daily >= new Date()) return Embed.setError(`Попробуй ещё раз через ${DateTime.formatTime(DateTime.getTimeData(thisUser.cooldowns.daily.getTime()))}.`).interactionReply(interaction);

        await Promise.all([
            changeMoney(interaction.user.id, REWARD.daily.amount, REWARD.daily.type),
            new Models('User').model.updateOne({_id: interaction.user.id}, {$set: {"cooldowns.daily": new Date(Date.now() + OneDay)}})
        ])

        Embed
            .setTitle("Ежедневная Награда")
            .setText(`Вы получаете ${Currency.types[REWARD.daily.type].emoji} ${Currency.formatNumber(REWARD.daily.amount)}.`)
            .setColor('BLURPLE')
            .interactionReply(interaction)
    }
})