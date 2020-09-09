'use strict';

import { Request, Response, NextFunction } from 'express';
import * as joi from 'joi';

/**
 * Default Validation Callback.
 * @param {Object} req request
 * @param {Object} res response
 * @param {NextFunction} next next function
 * @returns {Function}
 */
function validationCallback(
    req: Request,
    res: Response,
    next: NextFunction
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
 */
function middleware(schema): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
        const objectToValidate = {};
        ['params', 'body', 'query', 'headers'].forEach((key) => {
            if (schema[key]) {
                objectToValidate[key] = req[key];
            }
        });

        return (joi as any).validate(objectToValidate, schema, {}, validationCallback(req, res, next));
    };
}

export default (schema) => middleware(schema);
