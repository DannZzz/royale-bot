import { EmojiResolvable, Interaction, Message, MessageActionRow, MessageAttachment, MessageButton, MessageEmbed } from "discord.js";
import { PAGINATION_EMOJIS } from "../config";

export interface PaginationOptions {
    readonly interaction: Interaction;
    readonly embeds: MessageEmbed[]
    readonly attachments?: MessageAttachment[];
    readonly timeout?: number
    readonly validIds: string[]
    readonly emojis?: EmojiResolvable[]
}

export class Pagination implements PaginationOptions {
    readonly interaction: Interaction;
    readonly attachments?: MessageAttachment[] = [];
    readonly embeds: MessageEmbed[];
    readonly timeout?: number = 100000;
    readonly validIds: string[]
    readonly emojis?: EmojiResolvable[]
    constructor(options: PaginationOptions) {
        Object.assign(this, options);
    }

    public async createSimplePagination(): Promise<Message> {
        if (this.embeds.length === 0) throw new Error('Pagination: Embeds length must be 1 or more');
        if (this.embeds.length === 1) {
            return this.interaction.channel.send({ embeds: [this.embeds[0].setFooter({ text: "1 / 1" })], files: this?.attachments?.length > 0 ? [this.attachments[0]] : [] });
        }
        var page = 0;

        const buttons = [
            new MessageButton()
                .setCustomId("left")
                .setStyle("SECONDARY")
                .setEmoji(this.emojis?.[1] || PAGINATION_EMOJIS[1]),
            new MessageButton()
                .setCustomId("right")
                .setStyle("SECONDARY")
                .setEmoji(this.emojis?.[2] || PAGINATION_EMOJIS[2])
        ]

        const row = new MessageActionRow().addComponents(buttons);
        
        const curPage = await this.interaction.channel.send({ embeds: [this.embeds[page].setFooter({ text: `${page + 1} / ${this.embeds.length}` })], files: this?.attachments?.length > 0 ? [this.attachments[page]] : [], components: [row] });

        const collector = curPage.createMessageComponentCollector({
            filter: i => {
                if (!buttons.map(b => b.customId).includes(i.customId)) return false;
                if (i.user.id === this.interaction.user.id) return true;
                i.reply({ ephemeral: true, content: "Команду запросил другой человек." })
            },
            time: this.timeout
        });

        collector.on("end", () => {
            const newRow = new MessageActionRow().addComponents(buttons.map(b => b.setDisabled(true)));
            curPage.edit({ components: [newRow] });
        });

        collector.on("collect", async b => {
            await b.deferUpdate();
            collector.resetTimer();

            switch (b.customId) {
                case buttons[0].customId: {
                    page = page > 0 ? --page : this.embeds.length - 1;
                    break;
                }
                case buttons[1].customId: {
                    page = page + 1 < this.embeds.length ? ++page : 0;
                    break
                }

            }
            await curPage.removeAttachments()
            await curPage.edit({ embeds: [this.embeds[page].setFooter({ text: `${page+1} / ${this.embeds.length}` })], files: this?.attachments?.length > 0 ? [this.attachments[page]] : [] })
        });

        return curPage;
    }

    public async createAdvancedPagination(): Promise<Message> {
        if (this.embeds.length === 0) throw new Error('Pagination: Embeds length must be 1 or more');
        if (this.embeds.length === 1) {
            return this.interaction.channel.send({ embeds: [this.embeds[0].setFooter({ text: "1 / 1" })], files: this?.attachments?.length > 0 ? [this.attachments[0]] : [] });
        }
        var page = 0;

        const buttons = [
            new MessageButton()
                .setCustomId("mostleft")
                .setStyle("SECONDARY")
                .setEmoji(this.emojis?.[0] || PAGINATION_EMOJIS[0]),
            new MessageButton()
                .setCustomId("left")
                .setStyle("SECONDARY")
                .setEmoji(this.emojis?.[1] || PAGINATION_EMOJIS[1]),
            new MessageButton()
                .setCustomId("right")
                .setStyle("SECONDARY")
                .setEmoji(this.emojis?.[2] || PAGINATION_EMOJIS[2]),
            new MessageButton()
                .setCustomId("mostright")
                .setStyle("SECONDARY")
                .setEmoji(this.emojis?.[3] || PAGINATION_EMOJIS[3]),

        ]

        const row = new MessageActionRow().addComponents(buttons);
        const curPage = await this.interaction.channel.send({ embeds: [this.embeds[page].setFooter({ text: `${page + 1} / ${this.embeds.length}` })], files: this?.attachments?.length > 0 ? [this.attachments[page]] : [] , components: [row] });

        const collector = curPage.createMessageComponentCollector({
            filter: i => {
                if (!buttons.map(b => b.customId).includes(i.customId)) return false;
                if (i.user.id === this.interaction.user.id) return true;
                i.reply({ ephemeral: true, content: "Команду запросил другой человек." })
            },
            time: this.timeout
        });

        collector.on("end", () => {
            const newRow = new MessageActionRow().addComponents(buttons.map(b => b.setDisabled(true)));
            curPage.edit({ components: [newRow] });
        });

        collector.on("collect", async b => {
            await b.deferUpdate();
            collector.resetTimer();

            switch (b.customId) {
                case buttons[0].customId: {
                    page = 0;
                    break
                }
                case buttons[1].customId: {
                    page = page > 0 ? --page : this.embeds.length - 1;
                    break;
                }
                case buttons[2].customId: {
                    page = page + 1 < this.embeds.length ? ++page : 0;
                    break
                }
                case buttons[3].customId: {
                    page = this.embeds.length - 1;
                    break;
                }
            }
            await curPage.removeAttachments()    
            await curPage.edit({ embeds: [this.embeds[page].setFooter({ text: `${page+1} / ${this.embeds.length}` })], files: this?.attachments?.length > 0 ? [this.attachments[page]] : []  })
        });

        return curPage;
    }

}