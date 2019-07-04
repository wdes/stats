'use strict';

import { Request, Response } from 'express';
import * as joi from 'joi';

/**
 * Default Validation Callback.
 * @param {Object} req request
 * @param {Object} res response
 * @param {Function} next next function
 * @returns {Function}
 */
function validationCallback(
    req: Request,
    res: Response,
    next: Function
): (error: joi.ValidationError, value: any) => void {
    return (err, value) => {
        // Check if error
        if (err) {
            if (err.isJoi) {
                res.status(400).send({ success: false, msg: err.details[0].message });
            } else {
                next(err);
            }

            return;
        } else {
            next();
            return;
        }
    };
}

/**
 * Middleware function.
 * @param {Object} schema Schema to validate
 * @returns {Function}
 */
function middleware(schema): (req: Request, res: Response, next: Function) => void {
    return (req: Request, res: Response, next: Function) => {
        const objectToValidate = {};
        ['params', 'body', 'query', 'headers'].forEach(key => {
            if (schema[key]) {
                objectToValidate[key] = req[key];
            }
        });

        return joi.validate(objectToValidate, schema, {}, validationCallback(req, res, next));
    };
}

export default schema => middleware(schema);
