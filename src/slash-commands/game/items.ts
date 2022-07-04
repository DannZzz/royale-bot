import { SlashCommandBuilder } from "@discordjs/builders";
import { stripIndents } from "common-tags";
import { APIApplicationCommandOptionChoice } from "discord-api-types/v10";
import { EMOJIS } from "../../config";
import { AgeNamesEnum, AgesAsChoices } from "../../docs/ages/Age-Const";
import Ages from "../../docs/ages/Ages";
import Shop from "../../docs/ages/Shop";
import Currency from "../../docs/currency/Currency";
import SlashCommand from "../../typing/SlashCommand";
import { Pagination } from "../../typing/Pagination";

const data = new SlashCommandBuilder()
    .setName("предметы")
    .setDescription("Посмотреть предметы")
    .addStringOption(o => o
        .setName("эпоха")
        .setDescription("Предметы определённой эпохи")
        .setChoices(...AgesAsChoices())
        .setRequired(true))

export default new SlashCommand ({
    uniqueName: "age-items-list",
    data,
    async execute ({interaction, options, Embed, thisUser}) {
        const ageName = options.getString("эпоха");
        const items = Ages.getItems(ageName as any);
        const age = Ages.getAge(ageName as any);
        
        const hasItem = (uniqueName: string) => Boolean((thisUser?.ages?.[ageName] || []).find(i => i.item === uniqueName));

        const isPicked = (uniqueName: string) => ((thisUser?.ages?.[ageName] || [])?.find(i => i.item === uniqueName) as {isPicked: boolean, item: string})?.isPicked || '';

        const ageItems = items.map(item => `${isPicked(item.uniqueString) && "▸"}${item.emoji} \`${item.name}\` - ${hasItem(item.uniqueString) ? `\`${Currency.formatNumber(item.bonus)}\` | ✔` : "`??`"}`);

        const shopItems = Shop.items.filter(it => it.age === ageName).map(it => `${isPicked(it.uniqueString) && "▸"}${it.emoji} \`${it.name}\` - ${hasItem(it.uniqueString) ? `\`${Currency.formatNumber(it.bonus)}\` | ✔` : '`??`'}`);
        const toVisualate = [...ageItems, ...shopItems]
        const ageItemsEmbed = Embed
            .setText(stripIndents`
            **Эпоха**: ${age}
            
            **— Доступны в паках**
            ${ageItems.join("\n")}
            `)
            .setThumbnail(age.iconLink)
            .toEmbed();

        const shopItemsEmbed = Embed
            .setText(stripIndents`
            **Эпоха**: ${age}

            **— Доступны в магазине**
            ${shopItems.join("\n")}
            `)
            .setThumbnail(age.iconLink)
            .toEmbed();

        new Pagination({interaction, embeds: [ageItemsEmbed, shopItemsEmbed], validIds: [interaction.user.id]}).createSimplePagination();
    }
})