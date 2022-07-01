import { SlashCommandBuilder } from "@discordjs/builders";
import { PICKED_ITEMS_LIMIT } from "../../config";
import Models from "../../database/db";
import { AgeNames, AgesAsChoices } from "../../docs/ages/Age-Const";
import Ages from "../../docs/ages/Ages";
import Shop from "../../docs/ages/Shop";
import SlashCommand from "../../typing/SlashCommand";

export default new SlashCommand({
    uniqueName: 'pick-new-items',
    data: new SlashCommandBuilder()
        .setName("предмет")
        .setDescription('Надеть/Снять предмет')
        .addSubcommand(s => s
            .setName('экипировать')
            .setDescription('Экипировать предмет')
            .addStringOption(o => o
                .setName('эпоха')
                .setDescription("Эпоха предмета")
                .setRequired(true)
                .setChoices(...AgesAsChoices()))
            .addStringOption(o => o
                .setName('название')
                .setDescription('Название предмета')
                .setRequired(true)))
        .addSubcommand(s => s
            .setName('снять')
            .setDescription('Снять предмет')
            .addStringOption(o => o
                .setName('эпоха')
                .setDescription("Эпоха предмета")
                .setRequired(true)
                .setChoices(...AgesAsChoices()))
            .addStringOption(o => o
                .setName('название')
                .setDescription('Название предмета')
                .setRequired(true))),

    async execute({ thisUser, interaction, options, Embed }) {
        const ageName = options.getString('эпоха') as AgeNames;
        const itemName = options.getString('название');
        const method = options.getSubcommand();

        const item = Ages.findItemByName(itemName, ageName) || Shop.findItemByName(itemName, ageName);
        if (!item) return Embed.setError(`Предмет не найден!`).interactionReply(interaction);
        const items = thisUser.ages?.[ageName] || [];
        const index = items.findIndex(i => i.item === item.uniqueString);
        if (index === -1 || (!index && index !== 0)) return Embed.setError('Вы не имеете этот предмет.').interactionReply(interaction);

        const users = new Models('User').model;
        if (method === "экипировать") {
            if (items.filter(it => it.isPicked).length >= PICKED_ITEMS_LIMIT) return Embed.setError(`Можно надеть до ${PICKED_ITEMS_LIMIT}-и предметов для каждой эпохи!`).interactionReply(interaction);
            await users.updateOne({_id: interaction.user.id}, {$set: {[`ages.${ageName}.${index}.isPicked`]: true}});
            Embed.setSuccess(`Вы успешно экипировали предмет: ${item.emoji} **${item.name}**.`).interactionReply(interaction);
        } else {
            await users.updateOne({_id: interaction.user.id}, {$set: {[`ages.${ageName}.${index}.isPicked`]: false}});
            Embed.setSuccess(`Вы успешно сняли предмет: ${item.emoji} **${item.name}**.`).interactionReply(interaction);
        }
    }
})