export function parseKeyValueList(data) {
    return Object.fromEntries(data
        .split('\n')
        .map((item) => item.split(/=(.*)/))
        .filter(([key]) => key)
        .map(([key, value]) => [key, value ?? '']));
}
export async function hashObject(obj, length) {
    const str = JSON.stringify(obj, (_, value) => {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            return Object.keys(value)
                .sort()
                .reduce((result, key) => {
                result[key] = value[key];
                return result;
            }, {});
        }
        return value;
    });
    const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    const base64Hash = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    return base64Hash.slice(0, length);
}
//# sourceMappingURL=util.js.map