var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GraphQLClient_instances, _GraphQLClient_url, _GraphQLClient_headers, _GraphQLClient_query;
import { buildSchema, GraphQLError, parse, validate, } from 'graphql';
import { z } from 'zod';
export const graphqlRequestSchema = z.object({
    query: z.string(),
    variables: z.record(z.string(), z.unknown()).optional(),
});
export const graphqlResponseSuccessSchema = z.object({
    data: z.record(z.string(), z.unknown()),
    errors: z.undefined(),
});
export const graphqlErrorSchema = z.object({
    message: z.string(),
    locations: z.array(z.object({
        line: z.number(),
        column: z.number(),
    })),
});
export const graphqlResponseErrorSchema = z.object({
    data: z.undefined(),
    errors: z.array(graphqlErrorSchema),
});
export const graphqlResponseSchema = z.union([
    graphqlResponseSuccessSchema,
    graphqlResponseErrorSchema,
]);
export class GraphQLClient {
    constructor(options) {
        _GraphQLClient_instances.add(this);
        _GraphQLClient_url.set(this, void 0);
        _GraphQLClient_headers.set(this, void 0);
        __classPrivateFieldSet(this, _GraphQLClient_url, options.url, "f");
        __classPrivateFieldSet(this, _GraphQLClient_headers, options.headers ?? {}, "f");
        this.schemaLoaded =
            options
                .loadSchema?.({ query: __classPrivateFieldGet(this, _GraphQLClient_instances, "m", _GraphQLClient_query).bind(this) })
                .then((source) => ({
                source,
                schema: buildSchema(source),
            })) ?? Promise.reject(new Error('No schema loader provided'));
        this.schemaLoaded.catch(() => { });
    }
    async query(request, options = { validateSchema: true }) {
        try {
            const documentNode = parse(request.query);
            if (options.validateSchema) {
                const { schema } = await this.schemaLoaded;
                const errors = validate(schema, documentNode);
                if (errors.length > 0) {
                    throw new Error(`Invalid GraphQL query: ${errors.map((e) => e.message).join(', ')}`);
                }
            }
            return __classPrivateFieldGet(this, _GraphQLClient_instances, "m", _GraphQLClient_query).call(this, request);
        }
        catch (error) {
            if (error instanceof GraphQLError) {
                throw new Error(`Invalid GraphQL query: ${error.message}`);
            }
            throw error;
        }
    }
}
_GraphQLClient_url = new WeakMap(), _GraphQLClient_headers = new WeakMap(), _GraphQLClient_instances = new WeakSet(), _GraphQLClient_query = async function _GraphQLClient_query(request) {
    const { query, variables } = request;
    const response = await fetch(__classPrivateFieldGet(this, _GraphQLClient_url, "f"), {
        method: 'POST',
        headers: {
            ...__classPrivateFieldGet(this, _GraphQLClient_headers, "f"),
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch Supabase Content API GraphQL schema: HTTP status ${response.status}`);
    }
    const json = await response.json();
    const { data, error } = graphqlResponseSchema.safeParse(json);
    if (error) {
        throw new Error(`Failed to parse Supabase Content API response: ${error.message}`);
    }
    if (data.errors) {
        throw new Error(`Supabase Content API GraphQL error: ${data.errors
            .map((err) => `${err.message} (line ${err.locations[0]?.line ?? 'unknown'}, column ${err.locations[0]?.column ?? 'unknown'})`)
            .join(', ')}`);
    }
    return data.data;
};
export function getQueryFields(document) {
    return document.definitions
        .filter((def) => def.kind === 'OperationDefinition')
        .flatMap((def) => {
        if (def.kind === 'OperationDefinition' && def.selectionSet) {
            return def.selectionSet.selections
                .filter((sel) => sel.kind === 'Field')
                .map((sel) => {
                if (sel.kind === 'Field') {
                    return sel.name.value;
                }
                return null;
            })
                .filter(Boolean);
        }
        return [];
    });
}
//# sourceMappingURL=graphql.js.map