import { GraphQLSchema, type DocumentNode } from 'graphql';
import { z } from 'zod';
export declare const graphqlRequestSchema: z.ZodObject<{
    query: z.ZodString;
    variables: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    query: string;
    variables?: Record<string, unknown> | undefined;
}, {
    query: string;
    variables?: Record<string, unknown> | undefined;
}>;
export declare const graphqlResponseSuccessSchema: z.ZodObject<{
    data: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    errors: z.ZodUndefined;
}, "strip", z.ZodTypeAny, {
    data: Record<string, unknown>;
    errors?: undefined;
}, {
    data: Record<string, unknown>;
    errors?: undefined;
}>;
export declare const graphqlErrorSchema: z.ZodObject<{
    message: z.ZodString;
    locations: z.ZodArray<z.ZodObject<{
        line: z.ZodNumber;
        column: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        line: number;
        column: number;
    }, {
        line: number;
        column: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    message: string;
    locations: {
        line: number;
        column: number;
    }[];
}, {
    message: string;
    locations: {
        line: number;
        column: number;
    }[];
}>;
export declare const graphqlResponseErrorSchema: z.ZodObject<{
    data: z.ZodUndefined;
    errors: z.ZodArray<z.ZodObject<{
        message: z.ZodString;
        locations: z.ZodArray<z.ZodObject<{
            line: z.ZodNumber;
            column: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            line: number;
            column: number;
        }, {
            line: number;
            column: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        message: string;
        locations: {
            line: number;
            column: number;
        }[];
    }, {
        message: string;
        locations: {
            line: number;
            column: number;
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    errors: {
        message: string;
        locations: {
            line: number;
            column: number;
        }[];
    }[];
    data?: undefined;
}, {
    errors: {
        message: string;
        locations: {
            line: number;
            column: number;
        }[];
    }[];
    data?: undefined;
}>;
export declare const graphqlResponseSchema: z.ZodUnion<[z.ZodObject<{
    data: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    errors: z.ZodUndefined;
}, "strip", z.ZodTypeAny, {
    data: Record<string, unknown>;
    errors?: undefined;
}, {
    data: Record<string, unknown>;
    errors?: undefined;
}>, z.ZodObject<{
    data: z.ZodUndefined;
    errors: z.ZodArray<z.ZodObject<{
        message: z.ZodString;
        locations: z.ZodArray<z.ZodObject<{
            line: z.ZodNumber;
            column: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            line: number;
            column: number;
        }, {
            line: number;
            column: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        message: string;
        locations: {
            line: number;
            column: number;
        }[];
    }, {
        message: string;
        locations: {
            line: number;
            column: number;
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    errors: {
        message: string;
        locations: {
            line: number;
            column: number;
        }[];
    }[];
    data?: undefined;
}, {
    errors: {
        message: string;
        locations: {
            line: number;
            column: number;
        }[];
    }[];
    data?: undefined;
}>]>;
export type GraphQLRequest = z.infer<typeof graphqlRequestSchema>;
export type GraphQLResponse = z.infer<typeof graphqlResponseSchema>;
export type QueryFn = (request: GraphQLRequest) => Promise<Record<string, unknown>>;
export type QueryOptions = {
    validateSchema?: boolean;
};
export type GraphQLClientOptions = {
    url: string;
    loadSchema?({ query }: {
        query: QueryFn;
    }): Promise<string>;
    headers?: Record<string, string>;
};
export declare class GraphQLClient {
    #private;
    schemaLoaded: Promise<{
        source: string;
        schema: GraphQLSchema;
    }>;
    constructor(options: GraphQLClientOptions);
    query(request: GraphQLRequest, options?: QueryOptions): Promise<Record<string, unknown>>;
}
export declare function getQueryFields(document: DocumentNode): (string | null)[];
//# sourceMappingURL=graphql.d.ts.map