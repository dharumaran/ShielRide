import { fail } from '../http/envelope.js';
export function validateBody(schema) {
    return (req, res, next) => {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json(fail('VALIDATION_ERROR', 'Invalid request body', parsed.error.flatten()));
            return;
        }
        req.body = parsed.data;
        next();
    };
}
