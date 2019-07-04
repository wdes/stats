'use strict';

/**
 * Default Validation Callback.
 * @param req {Object} request
 * @param res {Object} response
 * @param next {Function} next function
 * @returns {Function}
 */
const validationCallback = function(req, res, next) {
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
};

/**
 * Middleware function.
 * @param schema {Object} Schema to validate
 * @param joi {Object} Joi library
 * @returns {Function}
 */
function middleware(schema, joi) {
    return (req, res, next) => {
        const objectToValidate = {};
        ['params', 'body', 'query', 'headers'].forEach(key => {
            if (schema[key]) {
                objectToValidate[key] = req[key];
            }
        });

        return joi.validate(objectToValidate, schema, {}, validationCallback(req, res, next));
    };
}

module.exports = function(joi) {
    return schema => middleware(schema, joi);
};
