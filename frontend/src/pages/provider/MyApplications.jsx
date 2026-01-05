import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { DollarSign, Calendar, MapPin, Search, Clock, CheckCircle, XCircle } from 'lucide-react';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/EmptyState';
import { applicationsAPI } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import ScrollReveal from '../../components/ui/ScrollReveal';

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
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <ScrollReveal>
                <div className="flex flex-col items-center justify-center gap-2 text-center py-8">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">My Applications</h1>
                    <p className="text-lg text-gray-600 max-w-2xl">Track and manage your job applications</p>
                </div>
            </ScrollReveal>

            {/* Applications List */}
            <ScrollReveal delay={0.1}>
                <Card className="border-2 shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="hidden">Applications</CardTitle>
                        <Tabs defaultValue="all" className="w-full">
                            <TabsList className="grid w-full grid-cols-4 p-1 bg-gray-100/80 rounded-xl mb-6">
                                <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200">
                                    All Applications
                                </TabsTrigger>
                                <TabsTrigger value="PENDING" className="rounded-lg data-[state=active]:bg-yellow-50 data-[state=active]:text-yellow-700 data-[state=active]:shadow-sm transition-all duration-200">
                                    Pending
                                </TabsTrigger>
                                <TabsTrigger value="ACCEPTED" className="rounded-lg data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:shadow-sm transition-all duration-200">
                                    Accepted
                                </TabsTrigger>
                                <TabsTrigger value="REJECTED" className="rounded-lg data-[state=active]:bg-red-50 data-[state=active]:text-red-700 data-[state=active]:shadow-sm transition-all duration-200">
                                    Rejected
                                </TabsTrigger>
                            </TabsList>

                            {/* Content Sections */}
                            <TabsContent value="all" className="space-y-4">
                                {applications.length === 0 ? (
                                    <EmptyState title="No applications yet" description="Browse available jobs and submit your first application" />
                                ) : (
                                    applications.map(app => <ApplicationCard key={app.id} application={app} />)
                                )}
                            </TabsContent>

                            <TabsContent value="PENDING" className="space-y-4">
                                {filterApplications('PENDING').length === 0 ? (
                                    <EmptyState title="No pending applications" description="You don't have any pending applications" />
                                ) : (
                                    filterApplications('PENDING').map(app => <ApplicationCard key={app.id} application={app} />)
                                )}
                            </TabsContent>

                            <TabsContent value="ACCEPTED" className="space-y-4">
                                {filterApplications('ACCEPTED').length === 0 ? (
                                    <EmptyState title="No accepted applications" description="Your accepted applications will appear here" />
                                ) : (
                                    filterApplications('ACCEPTED').map(app => <ApplicationCard key={app.id} application={app} />)
                                )}
                            </TabsContent>

                            <TabsContent value="REJECTED" className="space-y-4">
                                {filterApplications('REJECTED').length === 0 ? (
                                    <EmptyState title="No rejected applications" description="Your rejected applications will appear here" />
                                ) : (
                                    filterApplications('REJECTED').map(app => <ApplicationCard key={app.id} application={app} />)
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {/* Empty logic handled in TabsContent */}
                    </CardContent>
                </Card>
            </ScrollReveal>
        </div>
    );
};

const ApplicationCard = ({ application }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'PENDING':
                return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock };
            case 'ACCEPTED':
                return { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle };
            case 'REJECTED':
                return { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle };
            default:
                return { color: 'bg-gray-100 text-gray-800', icon: Clock };
        }
    };

    const statusConfig = getStatusConfig(application.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="group border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition-all duration-300 bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between sm:justify-start gap-3">
                        <h3 className="font-bold text-gray-900 text-lg">Job #{application.jobId}</h3>
                        <Badge className={`${statusConfig.color} border px-3 py-1 flex items-center gap-1.5`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {application.status}
                        </Badge>
                    </div>

                    <p className="text-gray-600 leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                        "{application.message}"
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-blue-50 px-3 py-1.5 rounded-full text-blue-700">
                            <DollarSign className="w-4 h-4" />
                            <span>Quote: {formatCurrency(application.quote)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 px-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>Available: {application.availability}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 px-2 ml-auto sm:ml-0">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>Applied {formatDate(application.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
