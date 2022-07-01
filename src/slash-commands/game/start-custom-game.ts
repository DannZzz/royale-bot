import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildBasedChannel } from "discord.js";
import { DEV_ID } from "../../config";
import { Games } from "../../typing/Games";
import SlashCommand from "../../typing/SlashCommand";

export default new SlashCommand ({
    uniqueName: "start-custom-game",
    staffOnly: true,
    data: new SlashCommandBuilder ()
.setDMPermission(false)
        .setName("начать-пользовательскую-игру")
        
        .setDescription("Начать пользовательскую игру сразу")
        .addChannelOption(o => o
            .setName("канал")
            .setDescription("Текстовый канал, где вы создали игру")),
    async execute ({interaction, options, Embed}) {
        const channel = (options.getChannel('канал') || interaction.channel) as GuildBasedChannel;

        if (channel.type !== "GUILD_TEXT") return Embed.setError('Канал должен быть **текстовым**.').interactionReply(interaction, {ephemeral: true});

        if (!Games.isExists(channel.id)) return Embed.setError('На этом канале нет созданных пользовательских игр.').interactionReply(interaction, {ephemeral: true});

        const game = Games.get(channel.id);
        if (game.host !== interaction.user.id && interaction.user.id !== DEV_ID) return Embed.setError("У вас нет созданных игр на этом канале.").interactionReply(interaction, {ephemeral: true});

        Games.start(channel.id, game.age);
        Embed
            .setSuccess('Игра успешно начинается...')
            .interactionReply(interaction, {ephemeral: true});

        Embed.clear()
            .setText(`**${interaction.user.username}** начал пользовательскую игру.`)
            .send(channel as any);
        
    }
})