export type ValueOf<T> = T[keyof T];
export type UnionToIntersection<U> = (U extends unknown ? (arg: U) => 0 : never) extends (arg: infer I) => 0 ? I : never;
export type LastInUnion<U> = UnionToIntersection<U extends unknown ? (x: U) => 0 : never> extends (x: infer L) => 0 ? L : never;
export type UnionToTuple<T, Last = LastInUnion<T>> = [T] extends [never] ? [] : [Last, ...UnionToTuple<Exclude<T, Last>>];
export declare function parseKeyValueList(data: string): {
    [key: string]: string;
};
export declare function hashObject(obj: Record<string, any>, length?: number): Promise<string>;
//# sourceMappingURL=util.d.ts.map