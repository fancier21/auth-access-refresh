import { type Request, type Response, type NextFunction } from 'express';
import Joi from 'joi';

const signupSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
});

export const signUpValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const validatedData = await signupSchema.validateAsync(req.body, {
            abortEarly: false,
        });
        console.log('Signup validated', validatedData);

        req.user = validatedData;

        next();
    } catch (error) {
        const fieldErrors: Record<string, string> = {};
        error.details.forEach((detail: any) => {
            fieldErrors[detail.context.key] = detail.message;
        });

        res.status(400).json({ fieldErrors });
    }
};
