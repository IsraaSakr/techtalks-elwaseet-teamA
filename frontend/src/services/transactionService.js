import api from './api';

export const transactionService = {
    createTransaction: (transactionData) =>
        api.post('/transactions', transactionData),

    getTransactions: (params) =>
        api.get('/transactions', { params }),

    getTransactionById: (id) =>
        api.get(`/transactions/${id}`),

    getTransactionsByJob: (jobId) =>
        api.get(`/transactions/job/${jobId}`),

    getMyTransactions: (params) =>
        api.get('/transactions/my-transactions', { params }),

    updateTransactionStatus: (id, status) =>
        api.patch(`/transactions/${id}/status`, { status }),

    processPayment: (paymentData) =>
        api.post('/transactions/process-payment', paymentData),

    requestRefund: (transactionId, refundData) =>
        api.post(`/transactions/${transactionId}/refund`, refundData),

    approveRefund: (transactionId) =>
        api.patch(`/transactions/${transactionId}/refund/approve`),

    rejectRefund: (transactionId, reason) =>
        api.patch(`/transactions/${transactionId}/refund/reject`, { reason }),

    releasePayment: (transactionId) =>
        api.post(`/transactions/${transactionId}/release`),

    holdInEscrow: (transactionId) =>
        api.post(`/transactions/${transactionId}/escrow`),

    getTransactionStats: (params) =>
        api.get('/transactions/stats', { params }),

    getEarningsSummary: (params) =>
        api.get('/transactions/earnings', { params }),

    getSpendingSummary: (params) =>
        api.get('/transactions/spending', { params }),

    downloadReceipt: (transactionId) =>
        api.get(`/transactions/${transactionId}/receipt`, {
            responseType: 'blob'
        }),

    downloadInvoice: (transactionId) =>
        api.get(`/transactions/${transactionId}/invoice`, {
            responseType: 'blob'
        }),

    addPaymentMethod: (paymentMethodData) =>
        api.post('/transactions/payment-methods', paymentMethodData),

    getPaymentMethods: () =>
        api.get('/transactions/payment-methods'),

    deletePaymentMethod: (paymentMethodId) =>
        api.delete(`/transactions/payment-methods/${paymentMethodId}`),

    setDefaultPaymentMethod: (paymentMethodId) =>
        api.patch(`/transactions/payment-methods/${paymentMethodId}/default`),

    getPayoutSettings: () =>
        api.get('/transactions/payout-settings'),

    updatePayoutSettings: (settingsData) =>
        api.put('/transactions/payout-settings', settingsData),

    requestPayout: (payoutData) =>
        api.post('/transactions/payout', payoutData),

    getPayoutHistory: (params) =>
        api.get('/transactions/payouts', { params }),

    getWalletBalance: () =>
        api.get('/transactions/wallet/balance'),

    addFundsToWallet: (fundData) =>
        api.post('/transactions/wallet/add-funds', fundData),
};

export default transactionService;