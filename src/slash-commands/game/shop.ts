import { SlashCommandBuilder } from "@discordjs/builders";
import { stripIndents } from "common-tags";
import { MessageActionRow, MessageSelectMenu, MessageSelectOptionData, SelectMenuInteraction } from "discord.js";
import Models, { changeMoney } from "../../database/db";
import Shop, { ShopItem } from "../../docs/ages/Shop";
import Currency from "../../docs/currency/Currency";
import Packs from "../../docs/packs/Packs";
import { PackNamesEnum } from "../../docs/packs/Packs-const";
import Functions from "../../typing/Functions";
import SlashCommand from "../../typing/SlashCommand";

export default new SlashCommand ({
    uniqueName: "shop-items",
    data: new SlashCommandBuilder()
        
        .setName("магазин")
        .setDescription('Посмотреть магазин предметов'),
    async execute ({interaction, Embed, thisUser}) {

        const classicPack = Packs.getPacks('Classic');

        const packVisualate = [classicPack];

        const packOptions: MessageSelectOptionData[] = packVisualate.map(p => {
            return {
                emoji: p.emoji,
                value: `pack$${p.ageOrName}`,
                label: PackNamesEnum[p.ageOrName],
                description: `Купить ${PackNamesEnum[p.ageOrName]}`
            }
        })

        const items = (await (new Models('Bot')).findOrCreate("main")).shopItems as ShopItem[];

        const itemOptions: MessageSelectOptionData[] = items.map(i => {
            return {
                emoji: i.emoji,
                label: i.name,
                value: `item$${i.uniqueString}`,
                description: `Купить ${i.name}`
            }
        })

        const options = [...packOptions, ...itemOptions];

        var date = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"}));
        var h0 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0);
        if(date.getHours() >= 0) {
            h0.setDate(h0.getDate()+1);
        }
        
        const EmbedConstructor = Embed
            .setAuthor('Чёрный Рынок')
            .setText(stripIndents`
            ${Currency.createMoneyInterface(thisUser)}
            `)
            .setFooter(`Магазин обновится`)
            .setTime(h0)
            .newField('Паки Эпохи', packVisualate.map((p, i) => `\` ${i+1} \` ${p} - ${Currency.types[p.cost.type].emoji} \`${Currency.formatNumber(p.cost.amount)}\``).join("\n"), false)
            .newField("Предметы", `${items.map(it => it).map((it, i) => `\` ${i+1} \` ${it.emoji} **${it.name}** (${it.bonus}) - ${Currency.types[it.buying.type].emoji} \`${Currency.formatNumber(it.buying.amount)}\``).join("\n")}`, false)
            .setThumbnail('https://cdn.discordapp.com/attachments/991649056382271498/991649121326878780/unknown.png')
            .setColor("#000000");

        const msg = await EmbedConstructor.interactionReply(interaction, {components: [new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('shop').setPlaceholder('Нажмите на нужный предмет..').addOptions(options))]});
        const collector = msg.createMessageComponentCollector({
            time: 30 * 1000,
            filter: i => i.user.id === interaction.user.id
        });

        collector.on('end', () => {
            msg.edit({components: msg.components.map(x => new MessageActionRow().addComponents(x.components.map(c => c.setDisabled(true))))})
        })

        collector.on('collect', async (int: SelectMenuInteraction): Promise<any> => {
            const value = int.values[0];
            const type = value.split("$")[0];
            const item = value.split("$")[1];
            const users = new Models('User');
            const userData = await users.findOrCreate(int.user.id);
            await int.deferUpdate();
            if (type === "pack") {
                const pack = Packs.getPacks(item as any);
                if (userData[pack.cost.type] < pack.cost.amount) return Embed.clear().setError(`Вам не хватает ещё ${Currency.types[pack.cost.type].emoji} \` ${Currency.formatNumber(Math.round(pack.cost.amount - userData[pack.cost.type]))} \``).interactionFollow(int, {ephemeral: true});
                const packs = Functions.changeObject(userData.packs, item as any, (userData?.packs?.[item] || 0) + 1);

                await Promise.all([
                    users.model.updateOne({_id: int.user.id}, {$set: {packs}}),
                    changeMoney(int.user.id, -pack.cost.amount, pack.cost.type)
                ]);

                return Embed.clear().setSuccess(`Вы успешно купили ${pack}.`).interactionFollow(interaction, {ephemeral: true});
            } else if (type === 'item') {
                const selItem = Shop.items.find(it => it.uniqueString === item);

                if (userData[selItem.buying.type] < selItem.buying.amount) return Embed.clear().setError(`Вам не хватает ещё ${Currency.types[selItem.buying.type].emoji} \` ${Currency.formatNumber(Math.round(selItem.buying.amount - userData[selItem.buying.type]))} \``).interactionFollow(int, {ephemeral: true});
                
                const items = Functions.changeObject(userData.ages, selItem.age, [...(userData.ages[selItem.age] || []), {item, isPicked: false}]);

                await Promise.all([
                    users.model.updateOne({_id: int.user.id}, {$set: {ages: items}}),
                    changeMoney(int.user.id, -selItem.buying.amount, selItem.buying.type)
                ]);

                return Embed.clear().setSuccess(`Вы успешно купили ${selItem.emoji} **${selItem.name}**.`).interactionFollow(interaction, {ephemeral: true});
            }
            
        })
    }
})
