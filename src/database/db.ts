import { Model } from "mongoose";
import { Guild } from "./models/Guild";
import { User } from "./models/User";
import Currency from "../docs/currency/Currency";
import { DEFAULT_PRIMARY, DEV_ID } from "../config";
import { Bot } from "./models/Bot";

interface models {
    Guild: Guild;
    User: User;
    Bot: Bot;
}

const models: {[k in keyof models]: Model<models[k]>} = {
    Guild,
    User,
    Bot,
}

type Get<K> = K extends keyof models ? models[K] : any;

export default class Models<T extends keyof typeof models, M extends Get<T>> {
    readonly model: typeof models[T];

    constructor(readonly modelName: T) {
        this.model = models[modelName];
        models[modelName].findOne()
    }

    /**
     * Finds a document
     * 
     * @param field schema field
     * @param value schema search value
     * @returns {M} document
     */
    async findOne<K extends keyof M, V extends M[K]>(field: K, value: V): Promise<M> {
        return await this.model.findOne({[field as any]: value});
    }

    /**
     * Creates a new document
     * 
     * @param {M} data new data as a document
     * @returns {M} created document
     */
    async create(data: M): Promise<M> {
        try {
            const newDoc = await this.model.create(data);
            await newDoc.save();
            return newDoc as any;
        } catch {
            return undefined;
        }
    }

    /**
     * Finds documents array
     * 
     * @param field schema field
     * @param value schema search value
     * @returns {M[]}
     */
    async findMany<K extends keyof M, V extends M[K]>(field: K, value: V): Promise<M[]> {
        return await this.model.find({[field as any]: value});
    }

    /**
     * Finds or creates if that doesn't exist by id
     * 
     * @param _id document id
     * @returns {M}
     */
    async findOrCreate(_id: string): Promise<M>;
    /**
     * Finds or creates if that doesn't exist by id
     * 
     * @param _id document id
     * @param additional additional data at creating
     * @returns {M}
     */
    async findOrCreate(_id: string, additional: Omit<M, "_id">): Promise<M>
    async findOrCreate(_id: string, additional?: Omit<M, "_id">): Promise<M> {
        const data = await this.model.findOne({_id: _id as any});
        if (!data) {
            return await this.create({...(additional || (this.modelName === "User" ? {"primary": DEFAULT_PRIMARY} : {})), _id} as M);
        } else {
            return data as any;
        }
    }

    /**
     * Deletes one document
     * 
     * @param field schema field
     * @param value schema search value
     * @returns {M} deleted model
     */
    async delete<K extends keyof M, V extends M[K]> (field: K, value: V): Promise<M> {
        const data = await this.findOne(field, value);
        if (!data) return undefined;
        await this.model.deleteOne({[field as any]: value});
        return data;
    }
}

/**
 * Checks if user has specified amount of money
 * 
 * @param _id user id
 * @param amount amount of money to check
 * @param type currency type
 * @returns {boolean}
 */
export async function hasMoney(_id: string, amount: number, type: keyof Currency): Promise<boolean> {
    const user = await (new Models("User")).findOne("_id", _id);
    if (!user) return false;
    if (user[type] >= amount) {
        return true;
    } else {
        return false;
    }
}

/**
 * Changes money
 * 
 * @param _id user id
 * @param amount amount of money to change
 * @param type currency type
 * @param notRound true if u want to change withour Math.round()
 */
export async function changeMoney(_id: string, amount: number, type: keyof Currency['types'], notRound: boolean = false): Promise<void> {
    await User.updateOne({_id}, {$inc: {[type]: notRound ? amount : Math.round(amount)}});
}