import { Util } from "client-discord";
import { stripIndents } from "common-tags";
import { Message, TextBasedChannel } from "discord.js";
import { colors, EMOJIS, GAME_JOIN_EMOJI } from "../config";
import Models from "../database/db";
import { User } from "../database/models/User";
import { AgeItem, AgeNames, GameTaksMethodsArray, GameTaskMethodsTyping } from "../docs/ages/Age-Const";
import Ages from "../docs/ages/Ages";
import Currency from "../docs/currency/Currency";
import Chest from "./Chest";
import EmbedConstructor from "./Embed-Constructor";

type ChannelId = string;

const games = new Chest<ChannelId, Game>()

interface Player {
    id: string;
    nickname: string;
    bonus: number;
    isDied: boolean;
    items: AgeItem[];
    pickedItems: AgeItem[];
    kills: number;
}

interface GameOptions {
    channel: TextBasedChannel;
    age: AgeNames;
    gameType: "normal" | "custom";
    players: Player[];
    host: string;
    isStarted: boolean;
    message: Message;
}

export class Games {
    static readonly games = games;

    static get (channelId: ChannelId) {
        return this.games.get(channelId);
    }
    
    static new (options: GameOptions) {
        const game = new Game(options);
        this.games.set(options.channel.id, game);
    }

    static isExists (channelId: ChannelId) {
        return this.games.has(channelId);
    }

    static remove (channelId: ChannelId) {
        const game = this.games.get(channelId);
        if (!game) return null;
        this.games.delete(channelId);
        return game;
    }

    static async start (channelId: string, age: AgeNames) {
        const game = this.games.get(channelId);
        if (!game) return console.log("not found");
        if (!game.isStarted) {
            const reactions = (await game.message.fetch()).reactions;
            const users = (await reactions.cache.get(GAME_JOIN_EMOJI as any).users.fetch()).filter(u => !u.bot);
            if (users.size === 0) return Games.remove(game.channel.id) && new EmbedConstructor(colors).setError('Никто не зашёл, игра отклонена!').send(game.channel);
            const players: Player[] = await Promise.all(users.map(async x => {
                const doc = await (new Models('User')).findOrCreate(x.id);
                const items = doc?.ages?.[age] || [];
                const bonus = items.reduce((bonus, item) => {if (item.isPicked) return bonus + Ages.getItems(age, 'force').find(i => i.uniqueString === item.item).bonus}, 0)
                return {
                    id: x.id,
                    nickname: doc.nickname || x.username,
                    kills: 0,
                    isDied: false,
                    pickedItems: items.filter(x => x.isPicked).map(x => Ages.getItems(age, 'force').find(it => it.uniqueString === x.item)),
                    items: items.map(x => Ages.getItems(age, 'force').find(it => it.uniqueString === x.item)),
                    bonus: bonus * 20 + 100
                }
            }));
            game.message.reactions.removeAll();
            game.players = players;
            game.isStarted = true;
        } 
        
        const gameTimer = setInterval(async () => {
            const randomPlayers = game.randomPlayers(6);
            const usedPlayers: Player[] = [];
            const texts: string[] = []
            randomPlayers.forEach((player, i) => {
                if (game.isEnded()) return;
                let todo: GameTaskMethodsTyping;
                const number = Util.random(0, 100);
                if (number <= 15) {
                    todo = 'killing'
                } else if (number <= 35) {
                    todo = 'selfKilling'
                } else if (number <= 65) {
                    todo = 'buffTaking'
                } else {
                    todo = 'walking';
                }
                switch (todo) {
                    case 'buffTaking': {
                        const bonus = Util.random(15, 50);
                        game.players[game.players.indexOf(player)].bonus += bonus;
                        let randomText = randomItem(Ages.getAge(game.age).jsonText.buffTaking);
                        randomText = randomText.replace("{p1}", `**${player.nickname}**`);
                        texts.push(`${EMOJIS.healing} | ${randomText}`);
                        break;
                    }

                    case 'walking': {
                        let randomText = randomItem(Ages.getAge(game.age).jsonText.walking);
                        randomText = randomText.replace("{p1}", `**${player.nickname}**`);
                        texts.push(`${randomText}`);
                        break;
                    }

                    case 'selfKilling': {                        
                        game.addDeath(player.id)
                        let randomText = randomItem(Ages.getAge(game.age).jsonText.selfKilling);
                        randomText = randomText.replace("{p1}", `**${player.nickname}**`);
                        texts.push(`${EMOJIS.selfKill} | ${randomText}`);
                        break;
                    }

                    case 'killing': {
                        let playerToKill = game.randomPlayers(1, [...randomPlayers, ...usedPlayers])[0];
                        if (!playerToKill && i + 1 === randomPlayers.length) {
                            let randomText = randomItem(Ages.getAge(game.age).jsonText.walking);
                            randomText = randomText.replace("{p1}", `**${player.nickname}**`);
                            texts.push(`${randomText}`);
                        } else {
                            if (!playerToKill) playerToKill = randomPlayers.pop();
                            if (player.bonus >= playerToKill.bonus) {
                                game.addKill(player.id);
                                game.addDeath(playerToKill.id);
                                game.players[game.players.indexOf(player)].bonus /= 2;
                                let randomText = randomItem(Ages.getAge(game.age).jsonText.killing);
                                randomText = randomText.replace("{p1}", `**${player.nickname}**`).replace("{p2}", `**${playerToKill.nickname}**`).replace("{item}", player.pickedItems.length > 0 ? randomItem(player.pickedItems).emoji as string : "👊");
                                texts.push(`${EMOJIS.kill} | ${randomText}`);
                            } else {
                                game.addDeath(player.id);
                                game.addKill(playerToKill.id);
                                game.players[game.players.indexOf(playerToKill)].bonus /= 2;
                                let randomText = randomItem(Ages.getAge(game.age).jsonText.killing);
                                randomText = randomText.replace("{p1}", `**${playerToKill.nickname}**`).replace("{p2}", `**${player.nickname}**`).replace("{item}", playerToKill.pickedItems.length > 0 ? randomItem(playerToKill.pickedItems).emoji as string : "👊");
                                texts.push(`${EMOJIS.kill} | ${randomText}`);
                            }
                            break;
                        }
                    }


                }
            })
            const emb = new EmbedConstructor(colors);
            
            emb.setText(texts.join("\n")).setFooter(`Осталось игроков: ${Currency.formatNumber(game.getCountOfPlayers())}`).send(game.channel);
            
            if (game.isEnded()) {
                emb.clear();
                clearInterval(gameTimer);
                const users = new Models('User').model;
                const age = Ages.getAge(game.age);
                const winner = game.players.find(x => !x.isDied);
                const reward = Math.round(game.players.length * age.moneyFromUser + winner.kills * age.moneyForKill);
                emb
                    .setTitle(`👑 **__Победа__**`)
                    .setThumbnail(age.iconLink)
                    .setText(stripIndents`
                    **__Победитель__**: **${winner.nickname}**
                    **__Награда__**: ${Currency.types[age.moneyType].emoji} \` ${Currency.formatNumber(reward)} \`
                    `).send(game.channel);

                await Promise.all([
                    users.updateOne({_id: winner.id}, {$inc: {[age.moneyType]: reward, wins: 1}}),
                    users.updateMany({_id: {$in: game.players.map(p => p.id)}}, {$inc: {gamesPlayed: 1}}),
                    ...(game.players.filter(p => p.kills > 0).map(async p => users.updateOne({_id: p.id}, {$inc: {kills: p.kills}}))),
                    users.updateOne({_id: game.host}, {$inc: {gamesHosted: 1}})
                ])
                Games.remove(game.channel.id);

            }



        }, 10 * 1000)

    }
}

class Game implements GameOptions {
    channel: TextBasedChannel;
    age: AgeNames;
    players: Player[];
    host: string;
    isStarted: boolean;
    gameType: "normal" | "custom";
    message: Message<boolean>;
    constructor (options: GameOptions) {
        Object.assign(this, options);
    }

    isEnded () {
        return this.players.filter(x => !x.isDied).length === 1;
    }

    addKill (userId: string) {
        const index = this.players.findIndex(x => x.id === userId);
        if (index === -1) return;
        this.players[index].kills++;
    }

    isUserExists (userId: string) {
        return Boolean(this.players.find(x => x.id === userId))
    }

    addDeath (userId: string) {
        const index = this.players.findIndex(x => x.id === userId);
        if (index === -1) return;
        this.players[index].isDied = true;
    }

    getCountOfPlayers () {
        return this.players.filter(x => !x.isDied).length;
    }

    randomPlayers (count: number, noInThis?: Player[]): Player[] {
        const players = [];
        const alivePlayers = this.players.filter(x => !x.isDied && (noInThis ? !noInThis.includes(x) : true));
        if (count >= alivePlayers.length) return alivePlayers;
        for (let i = 0; i < count; i++) {
            let pl = random();
            while (players.includes(pl)) pl = random();
            players.push(pl);
        }
        function random () {return alivePlayers[Math.floor(alivePlayers.length * Math.random())]};
        return players;
    }
}


export function randomItem<T> (arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}