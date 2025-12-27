import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { DollarSign, Calendar, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { EmptyState } from '../../components/shared/EmptyState';
import { formatCurrency, formatDate } from '../../lib/utils';

export const Transactions = () => {
    // Mock transactions data
    const [transactions] = useState([
        {
            id: 'txn-001',
            type: 'payment',
            amount: 150,
            description: 'Payment for Plumbing Service',
            date: '2024-12-01T10:00:00Z',
            status: 'completed',
        },
        {
            id: 'txn-002',
            type: 'earning',
            amount: 200,
            description: 'Earned from House Cleaning',
            date: '2024-11-28T14:30:00Z',
            status: 'completed',
        },
        {
            id: 'txn-003',
            type: 'payment',
            amount: 75,
            description: 'Payment for Electrical Work',
            date: '2024-11-25T09:15:00Z',
            status: 'pending',
        },
    ]);

    const totalSpent = transactions
        .filter(t => t.type === 'payment' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalEarned = transactions
        .filter(t => t.type === 'earning' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
                <p className="text-gray-600 mt-1">View your payment history and earnings</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Spent
                        </CardTitle>
                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalSpent)}</div>
                        <p className="text-sm text-gray-500 mt-1">On services</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Earned
                        </CardTitle>
                        <ArrowDownLeft className="w-5 h-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalEarned)}</div>
                        <p className="text-sm text-gray-500 mt-1">From services</p>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions List */}
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                    {transactions.length === 0 ? (
                        <EmptyState
                            title="No transactions yet"
                            description="Your transaction history will appear here"
                        />
                    ) : (
                        <div className="space-y-4">
                            {transactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-full ${transaction.type === 'payment'
                                                ? 'bg-red-100'
                                                : 'bg-green-100'
                                            }`}>
                                            {transaction.type === 'payment' ? (
                                                <ArrowUpRight className="w-5 h-5 text-red-600" />
                                            ) : (
                                                <ArrowDownLeft className="w-5 h-5 text-green-600" />
                                            )}
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-900">{transaction.description}</h4>
                                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatDate(transaction.date)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className={`text-lg font-bold ${transaction.type === 'payment'
                                                ? 'text-red-600'
                                                : 'text-green-600'
                                            }`}>
                                            {transaction.type === 'payment' ? '-' : '+'}
                                            {formatCurrency(transaction.amount)}
                                        </div>
                                        <Badge className={
                                            transaction.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }>
                                            {transaction.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
