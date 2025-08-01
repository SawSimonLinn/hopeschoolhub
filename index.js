// ...existing code...
const processFinancialStats = require('./processFinancialStats');

// Example usage
const stats = {
  monthlyPayments: [100, 200, 300],
};

try {
  const result = processFinancialStats(stats);
  console.log('Processed Financial Stats:', result);
} catch (error) {
  console.error('Error processing financial stats:', error.message);
}
// ...existing code...
