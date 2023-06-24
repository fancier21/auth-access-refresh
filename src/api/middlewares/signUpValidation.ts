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
        // Validate request body against the defined schema
        const validatedData = await signupSchema.validateAsync(req.body, {
            abortEarly: false,
        });
        console.log('Signup validated', validatedData);

        // Attach the validated data to the request object for later use
        req.user = validatedData;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.log('Signup validated', error);
        // If validation fails, handle the error and structure the field errors
        const fieldErrors: Record<string, string> = {};
        error.details.forEach((detail: any) => {
            fieldErrors[detail.context.key] = detail.message;
        });

        res.status(400).json({ fieldErrors });
    }
};
