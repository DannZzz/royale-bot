import { ButtonInteraction, CacheType, ColorResolvable, CommandInteraction, DMChannel, Interaction, InteractionReplyOptions, Message, MessageEmbed, MessageOptions, ModalSubmitInteraction, NewsChannel, PartialDMChannel, SelectMenuInteraction, TextChannel, TextChannelResolvable, ThreadChannel, User, VoiceChannel } from "discord.js";

export default class EmbedConstructor {
    private _embed: MessageEmbed = new MessageEmbed();
    constructor (private readonly colors: {error: ColorResolvable, success: ColorResolvable, main: ColorResolvable}) {
        this._embed.setColor(colors.main)
    }

    toEmbed() {
        const embed = this._embed;
        this.clear();
        return embed;
    }

    setAuthor(name: string, iconURL?: string, url?: string) {
        this._embed.setAuthor({name, iconURL, url});
        return this;
    }

    clear() {
        this._embed = new MessageEmbed();
        return this;
    }

    setText(description: string) {
        this._embed.setDescription(description);
        this.setColor(this.colors.main)
        return this;
    }

    setUser (user: {text?: string, iconURL?: string} | User , position: "Footer" | "Author" = "Footer") {
        if (!user) return this;

        var name: string, iconURL: string;
        if (user instanceof User) {
            name = user.username;
            iconURL = user.avatarURL();
        } else {
            name = user.text;
            iconURL = user.iconURL;
        }

        if (position === "Author") {
            this._embed.setAuthor({name, iconURL});
        } else {
            this._embed.setFooter({text: name, iconURL})
        }
        return this;
    }

    setFooter(text: string, iconURL?: string) {
        this._embed.setFooter({text, iconURL});
        return this;
    }

    setImage(image: string) {
        this._embed.setImage(image);
        return this;
    }

    setThumbnail (thumb: string) {
        this._embed.setThumbnail(thumb);
        return this;
    }

    setColor(color?: ColorResolvable) {
        if (color) {
            this._embed.setColor(color);
        } else {
            this._embed.setColor(this.colors.main)
        }
        return this;
    }

    setError(description: string) {
        this._embed.setDescription(description);
        this.setColor(this.colors.error);
        return this;
    }

    setSuccess(description: string) {
        this._embed.setDescription(description);
        this.setColor(this.colors.success);
        return this;
    }

    setTitle(title: string) {
        this._embed.setTitle(title)
        return this;
    }

    setTime (time?: number | Date) {
        this._embed.setTimestamp(time);
        return this;
    }

    newField(name: string, value: string, inline: boolean = true) {
        this._embed.addField(name, value, inline);
        return this;
    }

    async interactionFollow<T extends CommandInteraction | ButtonInteraction | SelectMenuInteraction | ModalSubmitInteraction>(interaction: T, options: Omit<InteractionReplyOptions, "embeds"> = {}) {
        return await interaction.followUp({...options, embeds: [this._embed], fetchReply: true}) as Message;
    }

    async interactionReply<T extends CommandInteraction | ButtonInteraction | SelectMenuInteraction | ModalSubmitInteraction>(interaction: T, options: Omit<InteractionReplyOptions, "embeds"> = {}) {
        return await interaction.reply({...options, embeds: [this._embed], fetchReply: true}) as Message;
    }

    async send(channel: TextChannel | DMChannel | PartialDMChannel | VoiceChannel | NewsChannel | ThreadChannel, options: MessageOptions = {}, deleteAfter: number = null): Promise<Message> {
        const msg = await channel.send({...options, embeds: [...(options?.embeds || []), this._embed]})
        if (deleteAfter) setTimeout(() => msg.delete(), deleteAfter);
        return msg;
    }

    
}