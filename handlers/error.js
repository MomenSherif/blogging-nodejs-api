/** Response Error array
    [
      {
         field: "email",
         message": "momensherif.2019@gmail.com is already in use"
      }
    ]
 */
const validationErrorHandler = (err, req, res, next) => {
  if (!err.errors) return next(err);

  const errorKeys = Object.keys(err.errors);

  const errors = errorKeys.reduce(
    (acc, key) =>
      acc.concat({
        field: key,
        message: err.errors[key].message,
      }),
    []
  );

  res.status(err.statusCode || 422).json(errors);
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  const handledError = err.statusCode < 500;

  res.status(err.statusCode).json({
    message: handledError ? err.message : 'Something went wrong!',
  });
};

module.exports = { validationErrorHandler, errorHandler };
