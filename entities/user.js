import Joi from "joi";

const userAuthSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required()
});

export async function userValidation(data) {
    const { error, value } = userAuthSchema.validate(data, {
        abortEarly: false, // Show all validation errors, not just the first
        stripUnknown: true, // Remove unknown properties from the data
    });

    if (error) {
        // Format errors for cleaner integration
        const errorMessages = error.details.map((detail) => detail.message);
        const newError = new Error(`${errorMessages.join(' && ')}`);
        newError.status = 422;
        newError.isJoi = true;
        throw newError;
    }

    return value; // Return the sanitized and validated value
}