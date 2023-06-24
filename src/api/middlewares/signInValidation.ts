import { type Request, type Response, type NextFunction } from 'express';
import Joi from 'joi';

const signupSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
});

export const signInValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const validatedData = await signupSchema.validateAsync(req.body, {
            abortEarly: false,
        });

        req.user = validatedData;

        next();
    } catch (error) {
        console.log('Signup validated', error);
        const fieldErrors: Record<string, string> = {};
        error.details.forEach((detail: any) => {
            fieldErrors[detail.context.key] = detail.message;
        });

        res.status(400).json({ fieldErrors });
    }
};
