import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { PlusCircle, Briefcase, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { JobCard } from '../../components/shared/JobCard';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/EmptyState';
import { jobsAPI } from '../../lib/api';
import { ROUTES, JOB_STATUS } from '../../lib/constants';

export const CustomerDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        active: 0,
        completed: 0,
        pending: 0,
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await jobsAPI.getMyJobs();
            setJobs(data.jobs || []);

            // Calculate stats
            const active = data.jobs?.filter(j =>
                j.status === JOB_STATUS.IN_PROGRESS || j.status === JOB_STATUS.OPEN
            ).length || 0;
            const completed = data.jobs?.filter(j =>
                j.status === JOB_STATUS.CONFIRMED
            ).length || 0;
            const pending = data.jobs?.filter(j =>
                j.status === JOB_STATUS.COMPLETED
            ).length || 0;

            setStats({ active, completed, pending });
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterJobs = (status) => {
        if (!status) return jobs;
        if (status === 'active') {
            return jobs.filter(j =>
                j.status === JOB_STATUS.OPEN || j.status === JOB_STATUS.IN_PROGRESS
            );
        }
        if (status === 'completed') {
            return jobs.filter(j => j.status === JOB_STATUS.CONFIRMED);
        }
        if (status === 'pending') {
            return jobs.filter(j => j.status === JOB_STATUS.COMPLETED);
        }
        return jobs;
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Manage your jobs and track progress</p>
                </div>
                <Link to={ROUTES.POST_JOB}>
                    <Button size="lg">
                        <PlusCircle className="mr-2 w-5 h-5" />
                        Post New Job
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Active Jobs
                        </CardTitle>
                        <Briefcase className="w-5 h-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{stats.active}</div>
                        <p className="text-sm text-gray-500 mt-1">Currently in progress</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Pending Confirmation
                        </CardTitle>
                        <Clock className="w-5 h-5 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{stats.pending}</div>
                        <p className="text-sm text-gray-500 mt-1">Awaiting your confirmation</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Completed Jobs
                        </CardTitle>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{stats.completed}</div>
                        <p className="text-sm text-gray-500 mt-1">Successfully finished</p>
                    </CardContent>
                </Card>
            </div>

            {/* Jobs List */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="active">Active</TabsTrigger>
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                            <TabsTrigger value="completed">Completed</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="mt-6">
                            {jobs.length === 0 ? (
                                <EmptyState
                                    title="No jobs yet"
                                    description="Post your first job to get started with finding local service providers"
                                    action={
                                        <Link to={ROUTES.POST_JOB}>
                                            <Button>
                                                <PlusCircle className="mr-2 w-4 h-4" />
                                                Post Your First Job
                                            </Button>
                                        </Link>
                                    }
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {jobs.map(job => (
                                        <JobCard
                                            key={job.id}
                                            job={job}
                                            onViewDetails={(id) => window.location.href = ROUTES.CUSTOMER_JOB_DETAILS(id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="active" className="mt-6">
                            {filterJobs('active').length === 0 ? (
                                <EmptyState
                                    title="No active jobs"
                                    description="You don't have any jobs in progress at the moment"
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filterJobs('active').map(job => (
                                        <JobCard
                                            key={job.id}
                                            job={job}
                                            onViewDetails={(id) => window.location.href = ROUTES.CUSTOMER_JOB_DETAILS(id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="pending" className="mt-6">
                            {filterJobs('pending').length === 0 ? (
                                <EmptyState
                                    title="No pending confirmations"
                                    description="You don't have any jobs waiting for confirmation"
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filterJobs('pending').map(job => (
                                        <JobCard
                                            key={job.id}
                                            job={job}
                                            onViewDetails={(id) => window.location.href = ROUTES.CUSTOMER_JOB_DETAILS(id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="completed" className="mt-6">
                            {filterJobs('completed').length === 0 ? (
                                <EmptyState
                                    title="No completed jobs"
                                    description="Your completed jobs will appear here"
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filterJobs('completed').map(job => (
                                        <JobCard
                                            key={job.id}
                                            job={job}
                                            onViewDetails={(id) => window.location.href = ROUTES.CUSTOMER_JOB_DETAILS(id)}
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
