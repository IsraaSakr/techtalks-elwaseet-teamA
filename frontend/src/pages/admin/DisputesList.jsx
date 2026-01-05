import { useState } from 'react';
import { mockDisputes } from '../../lib/mockData';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { AlertCircle, Calendar, DollarSign, Eye, Search, Filter } from 'lucide-react';
import { EmptyState } from '../../components/shared/EmptyState';
import { formatCurrency, formatDate } from '../../lib/utils';
import { ROUTES } from '../../lib/constants';
import ScrollReveal from '../../components/ui/ScrollReveal';

export const DisputesList = () => {
    const navigate = useNavigate();

    // Mock disputes data - using centralized mock data
    const [disputes] = useState(mockDisputes);

    const filterDisputes = (status) => {
        if (!status) return disputes;
        return disputes.filter(d => d.status === status);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'UNDER_REVIEW':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'RESOLVED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'CLOSED':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const handleViewDispute = (id) => {
        navigate(ROUTES.ADMIN_DISPUTE_DETAILS(id));
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header */}
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Disputes Management</h1>
                    <p className="text-gray-600 mt-1">Review and resolve disputes between customers and providers</p>
                </div>
                <Button variant="outline" className="shadow-sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter View
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ScrollReveal delay={0.1}>
                    <Card className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Pending Disputes
                            </CardTitle>
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {filterDisputes('PENDING').length}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Require attention</p>
                        </CardContent>
                    </Card>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                    <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Under Review
                            </CardTitle>
                            <Eye className="w-5 h-5 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {filterDisputes('UNDER_REVIEW').length}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Being investigated</p>
                        </CardContent>
                    </Card>
                </ScrollReveal>

                <ScrollReveal delay={0.3}>
                    <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Resolved
                            </CardTitle>
                            <AlertCircle className="w-5 h-5 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {filterDisputes('RESOLVED').length}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">All time</p>
                        </CardContent>
                    </Card>
                </ScrollReveal>
            </div>

            {/* Disputes List */}
            {/* Disputes List */}
            <Card className="border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
                <CardHeader className="border-b bg-gray-50/50">
                    <div className="flex items-center justify-between">
                        <CardTitle>All Disputes</CardTitle>
                        <div className="relative w-64 hidden md:block">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                placeholder="Search disputes..."
                                className="w-full pl-8 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="bg-gray-100 p-1 rounded-full w-full md:w-auto inline-flex mb-6">
                            <TabsTrigger value="all" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
                            <TabsTrigger value="PENDING" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Pending</TabsTrigger>
                            <TabsTrigger value="UNDER_REVIEW" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Reviewing</TabsTrigger>
                            <TabsTrigger value="RESOLVED" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Resolved</TabsTrigger>
                            <TabsTrigger value="CLOSED" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Closed</TabsTrigger>
                        </TabsList>

                        {['all', 'PENDING', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED'].map((tabValue) => (
                            <TabsContent key={tabValue} value={tabValue} className="mt-0 focus-visible:outline-none">
                                {filterDisputes(tabValue === 'all' ? null : tabValue).length === 0 ? (
                                    <EmptyState
                                        title="No disputes found"
                                        description="There are no disputes in this category."
                                        className="py-12"
                                    />
                                ) : (
                                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                                        {filterDisputes(tabValue === 'all' ? null : tabValue).map((dispute) => (
                                            <div key={dispute.id} className="w-full">
                                                <DisputeCard
                                                    dispute={dispute}
                                                    onView={handleViewDispute}
                                                    getStatusColor={getStatusColor}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

const DisputeCard = ({ dispute, onView, getStatusColor }) => {
    return (
        <div className="group border rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 bg-white/60 border-gray-100">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(dispute.status)} px-3 py-1`}>
                            {dispute.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                             <Calendar className="w-3 h-3" />
                             {formatDate(dispute.createdAt)}
                        </span>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {dispute.jobTitle}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            <span className="font-semibold text-gray-700">Reason:</span> {dispute.reason}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-2 border-t border-gray-100/50">
                        <div className="flex items-center gap-1">
                            <span className="font-medium text-gray-400">Customer:</span>
                            <span className="text-gray-700">{dispute.customerName}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-300 hidden md:block" />
                        <div className="flex items-center gap-1">
                            <span className="font-medium text-gray-400">Provider:</span>
                            <span className="text-gray-700">{dispute.providerName}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-300 hidden md:block" />
                        <div className="flex items-center gap-1 font-semibold text-gray-900">
                            <DollarSign className="w-3.5 h-3.5 text-green-600" />
                            {formatCurrency(dispute.amount)}
                        </div>
                    </div>
                </div>

                <div className="flex md:flex-col items-center justify-end gap-2 md:pl-4 md:border-l md:border-gray-100">
                    <Button 
                        onClick={() => onView(dispute.id)} 
                        size="sm"
                        className="w-full md:w-auto bg-white text-gray-700 border hover:bg-gray-50 hover:text-blue-600 shadow-sm"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                    </Button>
                </div>
            </div>
        </div>
    );
};
