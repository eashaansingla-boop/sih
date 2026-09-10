const { getRecurringViolations: fetchRecurring } = require('./ai.controller');

const getRecurringViolations = fetchRecurring;
const getRecurringViolationsByMine = fetchRecurring;

module.exports = { getRecurringViolations, getRecurringViolationsByMine };
