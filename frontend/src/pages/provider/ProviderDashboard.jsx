import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Briefcase, Clock, CheckCircle, DollarSign } from 'lucide-react';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/EmptyState';
import { applicationsAPI } from '../../lib/api';
import { ROUTES, APPLICATION_STATUS } from '../../lib/constants';

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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
                    <p className="text-gray-600 mt-1">Manage your applications and find new jobs</p>
                </div>
                <Link to={ROUTES.BROWSE_JOBS}>
                    <Button size="lg">
                        <Briefcase className="mr-2 w-5 h-5" />
                        Browse Jobs
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Pending Applications
                        </CardTitle>
                        <Clock className="w-5 h-5 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{stats.pending}</div>
                        <p className="text-sm text-gray-500 mt-1">Awaiting response</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Active Jobs
                        </CardTitle>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{stats.accepted}</div>
                        <p className="text-sm text-gray-500 mt-1">Currently working on</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Applications
                        </CardTitle>
                        <DollarSign className="w-5 h-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                        <p className="text-sm text-gray-500 mt-1">All time</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link to={ROUTES.BROWSE_JOBS}>
                            <Button variant="outline" className="w-full">
                                <Briefcase className="mr-2 w-4 h-4" />
                                Find New Jobs
                            </Button>
                        </Link>
                        <Link to={ROUTES.MY_APPLICATIONS}>
                            <Button variant="outline" className="w-full">
                                <Clock className="mr-2 w-4 h-4" />
                                View Applications
                            </Button>
                        </Link>
                        <Link to={ROUTES.EDIT_PROFILE}>
                            <Button variant="outline" className="w-full">
                                <CheckCircle className="mr-2 w-4 h-4" />
                                Edit Profile
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                    {applications.length === 0 ? (
                        <EmptyState
                            title="No applications yet"
                            description="Browse available jobs and submit your first application"
                            action={
                                <Link to={ROUTES.BROWSE_JOBS}>
                                    <Button>
                                        <Briefcase className="mr-2 w-4 h-4" />
                                        Browse Jobs
                                    </Button>
                                </Link>
                            }
                        />
                    ) : (
                        <div className="space-y-4">
                            {applications.slice(0, 5).map(app => (
                                <div key={app.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Application #{app.id}</h3>
                                            <p className="text-sm text-gray-600 mt-1">Quote: ${app.quote}</p>
                                            <p className="text-sm text-gray-500 mt-1">{app.availability}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
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
        </div>
    );
};
