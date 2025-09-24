const { validationResult } = require('express-validator');

function validate(rules) {
	return async (req, res, next) => {
		await Promise.all(rules.map(validation => validation.run(req)));
		const result = validationResult(req);
		if (result.isEmpty()) {
			return next();
		}
		next({ type: 'validation', errors: result.array() });
	};
}

module.exports = validate;
