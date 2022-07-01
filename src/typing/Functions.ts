export default class Functions {
    static changeObject<T extends Object, K extends keyof T>(obj: T, key: K, value: T[K]): T {
        if (!obj || Object.keys(obj).length === 0) return {[key]: value} as any;
        const object = {...obj} as any;
        object[key] = value;
        return object;
    }
}