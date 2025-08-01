/**
 * Processes financial statistics.
 * @param {Object} stats - The financial stats object.
 * @param {Array} stats.monthlyPayments - Array of monthly payment amounts.
 * @returns {Object} Processed financial statistics.
 */
function processFinancialStats(stats) {
  // Validate that monthlyPayments is an array
  if (!Array.isArray(stats.monthlyPayments)) {
    throw new Error('stats.monthlyPayments must be an array');
  }

  // Calculate total payments
  const totalPayments = stats.monthlyPayments.reduce(
    (sum, payment) => sum + payment,
    0
  );

  // Calculate average payment
  const averagePayment =
    stats.monthlyPayments.length > 0
      ? totalPayments / stats.monthlyPayments.length
      : 0;

  // Return processed stats
  return {
    totalPayments,
    averagePayment,
    paymentCount: stats.monthlyPayments.length,
  };
}

// Export the function for use in other modules
module.exports = processFinancialStats;
