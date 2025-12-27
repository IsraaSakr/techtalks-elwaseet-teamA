import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { DollarSign, Calendar, MapPin } from 'lucide-react';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/EmptyState';
import { applicationsAPI } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';

export const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const data = await applicationsAPI.getMyApplications();
            setApplications(data.applications || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterApplications = (status) => {
        if (!status) return applications;
        return applications.filter(app => app.status === status);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                <p className="text-gray-600 mt-1">Track your job applications and their status</p>
            </div>

            {/* Applications List */}
            <Card>
                <CardHeader>
                    <CardTitle>Applications</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="PENDING">Pending</TabsTrigger>
                            <TabsTrigger value="ACCEPTED">Accepted</TabsTrigger>
                            <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="mt-6">
                            {applications.length === 0 ? (
                                <EmptyState
                                    title="No applications yet"
                                    description="Browse available jobs and submit your first application"
                                />
                            ) : (
                                <div className="space-y-4">
                                    {applications.map(app => (
                                        <ApplicationCard key={app.id} application={app} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="PENDING" className="mt-6">
                            {filterApplications('PENDING').length === 0 ? (
                                <EmptyState
                                    title="No pending applications"
                                    description="You don't have any pending applications at the moment"
                                />
                            ) : (
                                <div className="space-y-4">
                                    {filterApplications('PENDING').map(app => (
                                        <ApplicationCard key={app.id} application={app} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="ACCEPTED" className="mt-6">
                            {filterApplications('ACCEPTED').length === 0 ? (
                                <EmptyState
                                    title="No accepted applications"
                                    description="Your accepted applications will appear here"
                                />
                            ) : (
                                <div className="space-y-4">
                                    {filterApplications('ACCEPTED').map(app => (
                                        <ApplicationCard key={app.id} application={app} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="REJECTED" className="mt-6">
                            {filterApplications('REJECTED').length === 0 ? (
                                <EmptyState
                                    title="No rejected applications"
                                    description="Your rejected applications will appear here"
                                />
                            ) : (
                                <div className="space-y-4">
                                    {filterApplications('REJECTED').map(app => (
                                        <ApplicationCard key={app.id} application={app} />
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

const ApplicationCard = ({ application }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'ACCEPTED':
                return 'bg-green-100 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">Job #{application.jobId}</h3>
                        <Badge className={getStatusColor(application.status)}>
                            {application.status}
                        </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{application.message}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                        <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold">{formatCurrency(application.quote)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{application.availability}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                            <span>Applied {formatDate(application.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
