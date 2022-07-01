import { SlashCommandBuilder } from "@discordjs/builders";
import Models from "../../database/db";
import Ages from "../../docs/ages/Ages";
import Currency from "../../docs/currency/Currency";
import Packs from "../../docs/packs/Packs";
import Functions from "../../typing/Functions";
import { randomItem } from "../../typing/Games";
import SlashCommand from "../../typing/SlashCommand";

export default new SlashCommand({
    uniqueName: "openning-packs",
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName("пак")
        .setDescription("Открыть паки")
        .setDMPermission(false)
        .addStringOption(o => o
            .setName("название")
            .setRequired(true)
            .setDescription("Название пака")),
    async execute({ interaction, options, thisUser, Embed }) {
        const packName = options.getString("название", true)?.toLowerCase();
        const users = new Models('User').model;

        const pack = Packs.findPackByName(packName);
        if (pack) {
            if (!thisUser.packs[pack.ageOrName] || thisUser.packs[pack.ageOrName] <= 0) return Embed.setError(`Вы же не имеете больше таких паков..`).interactionReply(interaction);
            await users.updateOne({_id: interaction.user.id}, {$set: {packs: Functions.changeObject(thisUser.packs, pack.ageOrName, thisUser.packs[pack.ageOrName] - 1)}})
            if (pack.isAgePack) {
                var itemText = '';
                var moneyText = '';
                var primAdd = 0;
                var secAdd = 0;
                if (pack.reward.itemList) {
                    const item = randomItem(Ages.getItems(pack.reward.itemList));

                    const hasItem = Ages.hasItem(thisUser.ages[pack.reward.itemList], item.uniqueString);

                    if (hasItem) {
                        primAdd += 15;
                        itemText = `${item.emoji} **${item.name}** (т.к. вы уже имеете этот предмет, вы получите ${Currency.types.primary.emoji} 15).`;
                    } else {
                        itemText = `${item.emoji} **${item.name}**.`;
                        await users.updateOne({ _id: interaction.user.id}, {$push: {[`ages.${pack.reward.itemList}`]: {item: item.uniqueString, isPicked: false}}});
                    }
                }

                if (pack.reward.type) {
                    const amount = typeof pack.reward.amount === 'number' ? pack.reward.amount : pack.reward.amount();
                    if (pack.reward.type === 'primary') {
                        primAdd += amount;
                    } else {
                        secAdd += amount;
                    }
                    moneyText = `${Currency.types[pack.reward.type].emoji} ${Currency.formatNumber(amount)}`;
                }

                if (primAdd || secAdd) await users.updateOne({_id: interaction.user.id}, {$inc: {'primary': primAdd, secondary: secAdd}});
                Embed
                    .setText(`**__Награда__**: ${[moneyText, itemText].join(" и ")}`)
                    .setTitle(`Открытие Пака`)
                    .interactionReply(interaction)
            }
        } else {
            Embed
                .setError(`Такой пак не найден!\n\nВот список ваших паков..\n${Packs.visaulate(thisUser.packs).all.join('\n')}`)
                .interactionReply(interaction)
        }

    }
})