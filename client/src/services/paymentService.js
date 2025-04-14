// Simulated payment processing
export const processPayment = async (amount) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate success with 80% probability
      const isSuccess = Math.random() < 0.8;
      if (isSuccess) {
        resolve({ success: true, transactionId: Math.random().toString(36).substring(2, 15) });
      } else {
        reject(new Error('Payment failed. Please try again.'));
      }
    }, 2000); // Simulate network delay
  });
};
