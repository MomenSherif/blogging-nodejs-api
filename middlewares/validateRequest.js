const { validationResult } = require('express-validator');
const path = require('path');
const CustomError = require(path.join(__dirname, '../helper/CustomError'));

const validateRequest = (validatorsArray) => async (req, res, next) => {
  const validtaorPromises = validatorsArray.map((validator) =>
    validator.run(req)
  );

  await Promise.all(validtaorPromises);
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.errors.reduce((acc, err) => {
      acc[err.param] = {
        message: err.msg,
      };
      return acc;
    }, {});

    return next(new CustomError(422, 'Validation Error', errors));
  }
  next();
};

module.exports = validateRequest;
