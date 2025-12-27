import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { AlertCircle, Calendar, DollarSign, Eye } from 'lucide-react';
import { EmptyState } from '../../components/shared/EmptyState';
import { formatCurrency, formatDate } from '../../lib/utils';
import { ROUTES } from '../../lib/constants';

export const DisputesList = () => {
    const navigate = useNavigate();

    // Mock disputes data
    const [disputes] = useState([
        {
            id: 'dispute-001',
            jobId: 'job-002',
            jobTitle: 'House cleaning service',
            customerId: 'cust-001',
            customerName: 'John Customer',
            providerId: 'prov-001',
            providerName: 'Sarah Provider',
            amount: 200,
            reason: 'Work not completed as agreed',
            description: 'The provider did not clean the bathrooms as specified in the job description.',
            status: 'PENDING',
            createdAt: '2024-12-03T10:00:00Z',
        },
        {
            id: 'dispute-002',
            jobId: 'job-003',
            jobTitle: 'Install ceiling fan',
            customerId: 'cust-001',
            customerName: 'John Customer',
            providerId: 'prov-001',
            providerName: 'Sarah Provider',
            amount: 120,
            reason: 'Quality issues',
            description: 'The ceiling fan is making noise and not working properly.',
            status: 'UNDER_REVIEW',
            createdAt: '2024-12-02T14:30:00Z',
        },
        {
            id: 'dispute-003',
            jobId: 'job-001',
            jobTitle: 'Fix leaking kitchen sink',
            customerId: 'cust-001',
            customerName: 'John Customer',
            providerId: 'prov-001',
            providerName: 'Sarah Provider',
            amount: 75,
            reason: 'Payment issue',
            description: 'Customer refusing to pay after job completion.',
            status: 'RESOLVED',
            resolution: 'Payment released to provider',
            createdAt: '2024-11-28T09:15:00Z',
            resolvedAt: '2024-11-30T16:00:00Z',
        },
    ]);

    const filterDisputes = (status) => {
        if (!status) return disputes;
        return disputes.filter(d => d.status === status);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'UNDER_REVIEW':
                return 'bg-blue-100 text-blue-800';
            case 'RESOLVED':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleViewDispute = (id) => {
        navigate(ROUTES.ADMIN_DISPUTE_DETAILS(id));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Disputes Management</h1>
                <p className="text-gray-600 mt-1">Review and resolve disputes between customers and providers</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
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

                <Card>
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

                <Card>
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
            </div>

            {/* Disputes List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Disputes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="PENDING">Pending</TabsTrigger>
                            <TabsTrigger value="UNDER_REVIEW">Under Review</TabsTrigger>
                            <TabsTrigger value="RESOLVED">Resolved</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="mt-6">
                            {disputes.length === 0 ? (
                                <EmptyState
                                    title="No disputes"
                                    description="All disputes will appear here"
                                />
                            ) : (
                                <div className="space-y-4">
                                    {disputes.map(dispute => (
                                        <DisputeCard
                                            key={dispute.id}
                                            dispute={dispute}
                                            onView={handleViewDispute}
                                            getStatusColor={getStatusColor}
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="PENDING" className="mt-6">
                            {filterDisputes('PENDING').length === 0 ? (
                                <EmptyState
                                    title="No pending disputes"
                                    description="Pending disputes will appear here"
                                />
                            ) : (
                                <div className="space-y-4">
                                    {filterDisputes('PENDING').map(dispute => (
                                        <DisputeCard
                                            key={dispute.id}
                                            dispute={dispute}
                                            onView={handleViewDispute}
                                            getStatusColor={getStatusColor}
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="UNDER_REVIEW" className="mt-6">
                            {filterDisputes('UNDER_REVIEW').length === 0 ? (
                                <EmptyState
                                    title="No disputes under review"
                                    description="Disputes being reviewed will appear here"
                                />
                            ) : (
                                <div className="space-y-4">
                                    {filterDisputes('UNDER_REVIEW').map(dispute => (
                                        <DisputeCard
                                            key={dispute.id}
                                            dispute={dispute}
                                            onView={handleViewDispute}
                                            getStatusColor={getStatusColor}
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="RESOLVED" className="mt-6">
                            {filterDisputes('RESOLVED').length === 0 ? (
                                <EmptyState
                                    title="No resolved disputes"
                                    description="Resolved disputes will appear here"
                                />
                            ) : (
                                <div className="space-y-4">
                                    {filterDisputes('RESOLVED').map(dispute => (
                                        <DisputeCard
                                            key={dispute.id}
                                            dispute={dispute}
                                            onView={handleViewDispute}
                                            getStatusColor={getStatusColor}
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

const DisputeCard = ({ dispute, onView, getStatusColor }) => {
    return (
        <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{dispute.jobTitle}</h3>
                        <Badge className={getStatusColor(dispute.status)}>
                            {dispute.status.replace('_', ' ')}
                        </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">Reason:</span> {dispute.reason}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
                        <div>
                            <span className="text-gray-500">Customer:</span> {dispute.customerName}
                        </div>
                        <div>
                            <span className="text-gray-500">Provider:</span> {dispute.providerName}
                        </div>
                        <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            <span className="font-semibold">{formatCurrency(dispute.amount)}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                        <Calendar className="w-3 h-3" />
                        <span>Filed {formatDate(dispute.createdAt)}</span>
                    </div>
                </div>

                <Button onClick={() => onView(dispute.id)} size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                </Button>
            </div>
        </div>
    );
};
