const { body } = require('express-validator');

const forbiddenFieldsToBeUpdated = ['createdAt', 'updateAt', 'slug'];

const validateRequestExtraFields = (...fields) => {
  fields.push(...forbiddenFieldsToBeUpdated);
  return fields.map((field) =>
    body(field, `You can't update ${field}!`).not().exists()
  );
};

module.exports = validateRequestExtraFields;
