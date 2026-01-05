import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Briefcase, Clock, CheckCircle, DollarSign, Search } from 'lucide-react';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/EmptyState';
import { applicationsAPI } from '../../lib/api';
import { ROUTES, APPLICATION_STATUS } from '../../lib/constants';
import ScrollReveal from '../../components/ui/ScrollReveal';
import SpotlightCard from '../../components/ui/SpotlightCard';
import CountUp from '../../components/ui/CountUp';

export const ProviderDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        pending: 0,
        accepted: 0,
        total: 0,
    });

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const data = await applicationsAPI.getMyApplications();
            setApplications(data.applications || []);

            const pending = data.applications?.filter(a => a.status === APPLICATION_STATUS.PENDING).length || 0;
            const accepted = data.applications?.filter(a => a.status === APPLICATION_STATUS.ACCEPTED).length || 0;

            setStats({
                pending,
                accepted,
                total: data.applications?.length || 0,
            });
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <ScrollReveal>
                <div className="flex flex-col items-center justify-center gap-2 text-center py-8">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">Provider Dashboard</h1>
                    <p className="text-lg text-gray-600 max-w-2xl">Manage your applications and find new opportunities</p>
                    <div className="mt-4">
                        <Link to={ROUTES.BROWSE_JOBS}>
                            <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                                <Search className="mr-2 w-5 h-5" />
                                Browse New Jobs
                            </Button>
                        </Link>
                    </div>
                </div>
            </ScrollReveal>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ScrollReveal delay={0.1}>
                    <SpotlightCard className="bg-white border-gray-200 h-full" spotlightColor="rgba(234, 179, 8, 0.2)">
                        <div className="flex flex-row items-center justify-between pb-2">
                            <h3 className="text-sm font-medium text-gray-500">
                                Pending Applications
                            </h3>
                            <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gray-900">
                                <CountUp from={0} to={stats.pending} duration={1} />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Awaiting response</p>
                        </div>
                    </SpotlightCard>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                    <SpotlightCard className="bg-white border-gray-200 h-full" spotlightColor="rgba(34, 197, 94, 0.2)">
                        <div className="flex flex-row items-center justify-between pb-2">
                            <h3 className="text-sm font-medium text-gray-500">
                                Active Jobs
                            </h3>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gray-900">
                                <CountUp from={0} to={stats.accepted} duration={1} />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Currently working on</p>
                        </div>
                    </SpotlightCard>
                </ScrollReveal>

                <ScrollReveal delay={0.3}>
                    <SpotlightCard className="bg-white border-gray-200 h-full" spotlightColor="rgba(59, 130, 246, 0.2)">
                        <div className="flex flex-row items-center justify-between pb-2">
                            <h3 className="text-sm font-medium text-gray-500">
                                Total Applications
                            </h3>
                            <Briefcase className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gray-900">
                                <CountUp from={0} to={stats.total} duration={1} />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">All time</p>
                        </div>
                    </SpotlightCard>
                </ScrollReveal>
            </div>

            {/* Quick Actions */}
            <ScrollReveal delay={0.4}>
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link to={ROUTES.BROWSE_JOBS}>
                                <Button variant="outline" className="w-full h-12 text-lg border-2 hover:border-blue-200 hover:bg-blue-50">
                                    <Search className="mr-2 w-5 h-5" />
                                    Find New Jobs
                                </Button>
                            </Link>
                            <Link to={ROUTES.MY_APPLICATIONS}>
                                <Button variant="outline" className="w-full h-12 text-lg border-2 hover:border-blue-200 hover:bg-blue-50">
                                    <Clock className="mr-2 w-5 h-5" />
                                    View Applications
                                </Button>
                            </Link>
                            <Link to={ROUTES.EDIT_PROFILE}>
                                <Button variant="outline" className="w-full h-12 text-lg border-2 hover:border-blue-200 hover:bg-blue-50">
                                    <CheckCircle className="mr-2 w-5 h-5" />
                                    Edit Profile
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </ScrollReveal>

            {/* Recent Applications */}
            <ScrollReveal delay={0.5}>
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Recent Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {applications.length === 0 ? (
                            <EmptyState
                                title="No applications yet"
                                description="Browse available jobs and submit your first application"
                                action={
                                    <Link to={ROUTES.BROWSE_JOBS}>
                                        <Button>
                                            <Search className="mr-2 w-4 h-4" />
                                            Browse Jobs
                                        </Button>
                                    </Link>
                                }
                            />
                        ) : (
                            <div className="space-y-4">
                                {applications.slice(0, 5).map(app => (
                                    <div key={app.id} className="border rounded-xl p-4 hover:shadow-md transition-all duration-200 bg-white">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">Job #{app.jobId}</h3>
                                                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                                   <span className="flex items-center gap-1">
                                                       <DollarSign className="w-4 h-4" />
                                                       Quote: ${app.quote}
                                                   </span>
                                                   <span className="flex items-center gap-1">
                                                       <Clock className="w-4 h-4" />
                                                       {app.availability}
                                                   </span>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                    app.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </ScrollReveal>
        </div>
    );
};
