import { SlashCommandBuilder } from "@discordjs/builders";
import { GAME_JOIN_EMOJI } from "../../config";
import { AgeNamesEnum } from "../../docs/ages/Age-Const";
import Ages from "../../docs/ages/Ages";
import Currency from "../../docs/currency/Currency";
import Chest from "../../typing/Chest";
import { Games } from "../../typing/Games";
import SlashCommand from "../../typing/SlashCommand";

export default new SlashCommand ({
    uniqueName: "starting-game",
    staffOnly: true,
    data: new SlashCommandBuilder ()
.setDMPermission(false)
        .setName("создать-игру")
        .setDescription("Создать новую игру")
        
        .addStringOption(o => o
            .setName("эпоха")
            .setDescription("Выбрать эпоху игры")
            .setRequired(true)
            .setChoices(...choices()))
        .addStringOption(o => o
            .setName("тип-игры")
            .setDescription("Выбрать тип игры")
            .setRequired(true)
            .addChoices({name: "Нормальная игра: начнётся автоматически через минуту", value: "normal"}, {name: "Пользовательская игра: создатель игры решает, когда начнётся", value: "custom"})),
    async execute ({interaction, thisGuild, options, Embed, thisUser}) {
        const ageName = options.getString('эпоха');
        const gameType = options.getString('тип-игры') as ("normal" | "custom");
        
        const age = Ages.getAge(ageName as any);

        if (Games.isExists(interaction.channelId)) return Embed.setError("На этом канале уже действует игра!").interactionReply(interaction, {ephemeral: true});

        Embed
            .setText("Успешно создана новая игра!")
            .interactionReply(interaction, {ephemeral: true})

        const msg = await Embed
            .clear()
            .setThumbnail(age.iconLink)
            .setText(`Нажми на реакцию (${GAME_JOIN_EMOJI}) ниже, чтобы вступить в игру!`)
            .newField(`Создатель: \`${interaction.user.username}\``, `**Создано игр**: \` ${Currency.formatNumber(thisUser.gamesHosted)} \``)
            .newField(`Эпоха игры: ${age}`, `**Тип игры**: \`${gameType === "custom" ? "Пользовательский" : "Обычный"}\``, false)
            .newField(`Награда за 1 участника: ${Currency.types[age.moneyType].emoji} \` ${Currency.formatNumber(age.moneyFromUser)} \``, `**Награда за 1 килла**: ${Currency.types[age.moneyType].emoji} \` ${Currency.formatNumber(age.moneyForKill)} \``)
            .send(interaction.channel);

        Games.new({
            age: age.name,
            channel: interaction.channel,
            players: [],
            isStarted: false,
            host: interaction.user.id,
            gameType,
            message: msg
        });

        msg.react(GAME_JOIN_EMOJI);

        if (gameType === "normal") setTimeout(() => {
            Embed.clear().setText("Игра началась!").send(interaction.channel);
            Games.start(interaction.channelId, age.name)
        }, 60 * 1 * 1000)
        
    }
})


function choices() {
    const arr = [];

    for (let i in AgeNamesEnum) {
        arr.push({name: AgeNamesEnum[i], value: i});
    }

    return arr;
}
