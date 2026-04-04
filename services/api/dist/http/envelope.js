export function ok(data, meta = {}) {
    return { data, error: null, meta };
}
export function fail(code, message, details, meta = {}) {
    return { data: null, error: { code, message, details }, meta };
}
