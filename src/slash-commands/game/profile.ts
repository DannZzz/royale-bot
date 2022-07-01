import { SlashCommandBuilder } from "@discordjs/builders";
import { stripIndents } from "common-tags";
import Models from "../../database/db";
import Currency from "../../docs/currency/Currency";
import Packs from "../../docs/packs/Packs";
import SlashCommand from "../../typing/SlashCommand";

export default new SlashCommand ({
    uniqueName: "user-profile",
    data: new SlashCommandBuilder ()
.setDMPermission(false)
        .setName("профиль")
        .setDescription("Посмотреть свой профиль")
        
        .addUserOption(o => o
            .setName("участник")
            .setDescription("Посмотреть профиль другого участника")
            .setRequired(false)),
    async execute({options, interaction, thisUser, Embed}) {
        const docs = new Models('User');
        let u = interaction.user;
        let data = thisUser;
        const user = options.getUser('участник');
        if (user) {
            u = user;
            data = await docs.findOrCreate(u.id)
        };

        const curr = Currency.createMoneyInterface(data);
        const packs = Packs.visaulate(data.packs);
        const a = Embed
            .setTitle(`Профиль: ${u.username}`)
            .setColor(u.hexAccentColor)
            .setThumbnail(u.avatarURL({dynamic: true}))
            .setText(stripIndents`
            ${curr.join("\n")}
            `)
            

        if (packs.agePacks?.length > 0) a.newField("— Обычные Паки", packs.agePacks.join("\n"), false)
        if (packs.customPacks?.length > 0) a.newField("— Другие Паки", packs.customPacks.join("\n"), false);

        a
            .newField("—📈 Статистика", stripIndents`
            **Сыграно игр**: \` ${Currency.formatNumber(data.gamesPlayed)} \`
            **Создано игр**: \` ${Currency.formatNumber(data.gamesHosted)} \`
            **Выиграно игр**: \` ${Currency.formatNumber(data.wins)} \`
            **Киллы**: \` ${Currency.formatNumber(data.kills)} \`
            `, false)
            .interactionReply(interaction)
        
    },
})