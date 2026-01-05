import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import SpotlightCard from '../../components/ui/SpotlightCard';
import { Badge } from '../../components/ui/badge';
import { DollarSign, Calendar, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { EmptyState } from '../../components/shared/EmptyState';
import { formatCurrency, formatDate } from '../../lib/utils';
import AnimatedList from '../../components/ui/AnimatedList';
import ScrollReveal from '../../components/ui/ScrollReveal';
import { mockTransactions } from '../../lib/mockData';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../lib/constants';

export const Transactions = () => {
    // Mock transactions data - using centralized mock data
    const [transactions] = useState(mockTransactions);
    const { user } = useAuth();

    const filteredTransactions = transactions.filter(t => {
        if (user?.role === USER_ROLES.CUSTOMER) {
            return t.type !== 'earning';
        }
        return true;
    });

    const totalSpent = filteredTransactions
        .filter(t => t.type === 'payment' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalEarned = transactions
        .filter(t => t.type === 'earning' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <ScrollReveal>
                <div className="flex flex-col items-center justify-center gap-2 text-center py-8">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">Transactions</h1>
                    <p className="text-lg text-gray-600 max-w-2xl">View your payment history and earnings</p>
                </div>
            </ScrollReveal>

            {/* Summary Cards */}
            <div className={user?.role === USER_ROLES.CUSTOMER ? "flex justify-center" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
                {(user?.role === USER_ROLES.CUSTOMER || user?.role === USER_ROLES.PROVIDER || user?.role === USER_ROLES.ADMIN) && (
                    <ScrollReveal delay={0.1} className={user?.role === USER_ROLES.CUSTOMER ? "w-full max-w-md" : "w-full"}>
                        <SpotlightCard className="w-full bg-white border-neutral-200" spotlightColor="rgba(220, 38, 38, 0.2)">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 p-0">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Total Spent
                                </CardTitle>
                                <ArrowUpRight className="w-5 h-5 text-red-600" />
                            </CardHeader>
                            <CardContent className="p-0 pt-4">
                                <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalSpent)}</div>
                                <p className="text-sm text-gray-500 mt-1">On services</p>
                            </CardContent>
                        </SpotlightCard>
                    </ScrollReveal>
                )}

                {(user?.role === USER_ROLES.PROVIDER || user?.role === USER_ROLES.ADMIN) && (
                    <ScrollReveal delay={0.2} className="w-full">
                        <SpotlightCard className="w-full bg-white border-neutral-200" spotlightColor="rgba(22, 163, 74, 0.2)">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 p-0">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Total Earned
                                </CardTitle>
                                <ArrowDownLeft className="w-5 h-5 text-green-600" />
                            </CardHeader>
                            <CardContent className="p-0 pt-4">
                                <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalEarned)}</div>
                                <p className="text-sm text-gray-500 mt-1">From services</p>
                            </CardContent>
                        </SpotlightCard>
                    </ScrollReveal>
                )}
            </div>

            {/* Transactions List */}
            <ScrollReveal delay={0.3}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center border-b border-gray-200 border-b-2 pb-2">Transaction History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filteredTransactions.length === 0 ? (
                            <EmptyState
                                title="No transactions yet"
                                description="Your transaction history will appear here"
                            />
                        ) : (
                            <AnimatedList
                                items={filteredTransactions}
                                className="w-full"
                                itemClassName="bg-transparent p-0 mb-3"
                                displayScrollbar={false}
                                renderItem={(transaction) => (
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
                                )}
                            />
                        )}
                    </CardContent>
                </Card>
            </ScrollReveal>
        </div>
    );
};
