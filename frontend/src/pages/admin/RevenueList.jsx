import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Search, Filter, DollarSign, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';
// import ScrollReveal from '../../components/ui/ScrollReveal';

import { mockTransactions } from '../../lib/mockData';

export const RevenueList = () => {
    // Mock revenue data - using centralized mock transactions
    const [transactions] = useState(mockTransactions);

    const getTypeColor = (type) => {
        switch (type) {
            case 'COMMISSION':
                return 'text-green-600 bg-green-50 border-green-100';
            case 'PAYOUT':
                return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'REFUND':
                return 'text-red-600 bg-red-50 border-red-100';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'COMMISSION':
                return <ArrowDownLeft className="w-4 h-4" />;
            case 'PAYOUT':
                return <ArrowUpRight className="w-4 h-4" />;
            case 'REFUND':
                return <ArrowUpRight className="w-4 h-4" />;
            default:
                return <DollarSign className="w-4 h-4" />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header */}
            {/* <ScrollReveal> */}
            <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Financial Overview</h1>
                        <p className="text-gray-600 mt-1">Track platform revenue and transactions</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="shadow-sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export Report
                        </Button>
                        <Button variant="outline" className="shadow-sm">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                    </div>
                </div>
            </div>
            {/* </ScrollReveal> */}

            {/* Revenue Stats (Mini) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-green-600">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-green-700 mt-1">$12,450.00</h3>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                     <CardContent className="p-6">
                        <p className="text-sm font-medium text-blue-600">Pending Payouts</p>
                        <h3 className="text-2xl font-bold text-blue-700 mt-1">$3,240.00</h3>
                    </CardContent>
                </Card>
                 <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
                     <CardContent className="p-6">
                        <p className="text-sm font-medium text-purple-600">Net Profit</p>
                        <h3 className="text-2xl font-bold text-purple-700 mt-1">$1,850.50</h3>
                    </CardContent>
                </Card>
            </div>


            {/* Transactions List */}
            {/* <ScrollReveal delay={0.2}> */}
            <div>
                <Card className="border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
                    <CardHeader className="border-b bg-gray-50/50">
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Transactions</CardTitle>
                            <div className="relative w-64 hidden md:block">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    placeholder="Search transactions..."
                                    className="w-full pl-8 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Transaction ID</th>
                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Type</th>
                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Amount</th>
                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">User</th>
                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Related Job</th>
                                        <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {transactions.map((txn) => (
                                        <tr key={txn.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-6 font-mono text-xs text-gray-500">
                                                {txn.id}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(txn.type)}`}>
                                                    {getTypeIcon(txn.type)}
                                                    {txn.type}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 font-medium text-gray-900">
                                                {formatCurrency(txn.amount)}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600">
                                                {txn.user}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-blue-600 hover:underline cursor-pointer">
                                                {txn.jobId}
                                            </td>
                                            <td className="py-4 px-6 text-right text-sm text-gray-500">
                                                {formatDate(txn.date)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* </ScrollReveal> */}
        </div>
    );
};
