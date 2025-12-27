import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Briefcase, AlertCircle, DollarSign } from 'lucide-react';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';

export const AdminDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [stats] = useState({
        totalUsers: 156,
        activeJobs: 42,
        pendingDisputes: 3,
        totalRevenue: 12450,
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Platform overview and management</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Users
                        </CardTitle>
                        <Users className="w-5 h-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
                        <p className="text-sm text-gray-500 mt-1">Registered accounts</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Active Jobs
                        </CardTitle>
                        <Briefcase className="w-5 h-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{stats.activeJobs}</div>
                        <p className="text-sm text-gray-500 mt-1">Currently in progress</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Pending Disputes
                        </CardTitle>
                        <AlertCircle className="w-5 h-5 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{stats.pendingDisputes}</div>
                        <p className="text-sm text-gray-500 mt-1">Require attention</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="w-5 h-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</div>
                        <p className="text-sm text-gray-500 mt-1">Platform earnings</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 pb-4 border-b">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">New user registered</p>
                                <p className="text-sm text-gray-500">John Doe joined as a customer</p>
                                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 pb-4 border-b">
                            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">Job completed</p>
                                <p className="text-sm text-gray-500">Plumbing service completed successfully</p>
                                <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">Dispute opened</p>
                                <p className="text-sm text-gray-500">Customer reported incomplete work</p>
                                <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
