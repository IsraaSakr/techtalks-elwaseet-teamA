import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useRef } from 'react';
import { PlusCircle, Briefcase, Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { JobCard } from '../../components/shared/JobCard';
import SpotlightCard from '../../components/ui/SpotlightCard';
import CountUp from '../../components/ui/CountUp';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/EmptyState';
import { jobsAPI } from '../../lib/api';
import { ROUTES, JOB_STATUS } from '../../lib/constants';
import ScrollReveal from '../../components/ui/ScrollReveal';

const JobList = ({ jobs }) => {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = container.clientWidth / 2;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative group">
            {/* Left Button - Desktop Only */}
            <Button
                variant="outline"
                size="icon"
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 rounded-full shadow-lg bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                onClick={() => scroll('left')}
            >
                <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Container: Grid on Mobile, Scroll on Desktop */}
            <div 
                ref={scrollContainerRef}
                className="grid grid-cols-2 gap-4 pb-4 px-2 -mx-2 bg-transparent md:flex md:overflow-x-auto md:scrollbar-hide md:snap-x"
            >
                {jobs.map((job) => (
                    <JobCard
                        key={job.id}
                        job={job}
                        onViewDetails={(id) => navigate(ROUTES.CUSTOMER_JOB_DETAILS(id))}
                        className="w-full md:w-[calc(33.33%-11px)] md:min-w-[calc(33.33%-11px)] md:flex-shrink-0 md:snap-start"
                    />
                ))}
            </div>

            {/* Right Button - Desktop Only */}
            <Button
                variant="outline"
                size="icon"
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 rounded-full shadow-lg bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => scroll('right')}
            >
                <ChevronRight className="h-5 w-5" />
            </Button>
        </div>
    );
};

export const CustomerDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('all');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        active: 0,
        completed: 0,
        pending: 0,
    });

    useEffect(() => {
        fetchJobs();
    }, [user]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await jobsAPI.getMyJobs();
            const allJobs = data.content || [];
            
            // Filter to only this user's jobs
            const myJobs = allJobs.filter(job => job.customer?.id === user?.userId);
            setJobs(myJobs);

            const active = myJobs.filter(j =>
                j.status === JOB_STATUS.IN_PROGRESS || j.status === JOB_STATUS.OPEN
            ).length;
            const completed = myJobs.filter(j => j.status === JOB_STATUS.CONFIRMED).length;
            const pending = myJobs.filter(j => j.status === JOB_STATUS.COMPLETED).length;

            setStats({ active, completed, pending });
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterJobs = (status) => {
        if (!status || status === 'all') return jobs;
        if (status === 'active') {
            return jobs.filter(j => j.status === JOB_STATUS.IN_PROGRESS);
        }
        if (status === 'pending') {
            return jobs.filter(j => j.status === JOB_STATUS.OPEN);
        }
        if (status === 'completed') {
            return jobs.filter(j => j.status === JOB_STATUS.COMPLETED);
        }
        if (status === 'confirmed') {
            return jobs.filter(j => j.status === JOB_STATUS.CONFIRMED);
        }
        if (status === 'disputed') {
            return jobs.filter(j => j.status === JOB_STATUS.DISPUTED);
        }
        return jobs;
    };

    if (loading) {
        return <LoadingSpinner />;
    }
    return (
        <div className="space-y-6" >
            {/* Header */}
            <ScrollReveal>
                <div className="flex flex-col items-center justify-center gap-2 text-center py-8">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">Dashboard</h1>
                    <p className="text-lg text-gray-600 max-w-2xl">Manage your jobs and track progress from one central hub</p>
                </div>
            </ScrollReveal>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-2 md:gap-6">
                <ScrollReveal delay={0.1} className="h-full">
                    <div onClick={() => setActiveTab('active')} className="h-full cursor-pointer">
                        <SpotlightCard className="h-full bg-white border-gray-200" spotlightColor="rgba(59, 130, 246, 0.2)">
                            <div className="flex flex-row items-center justify-between pb-2">
                            <h3 className="text-sm font-medium text-gray-500">
                                Active Jobs
                            </h3>
                            <Briefcase className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gray-900">
                                <CountUp
                                    from={0}
                                    to={stats.active}
                                    separator=","
                                    direction="up"
                                    duration={1}
                                    className="count-up-text"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Currently in progress</p>
                        </div>
                    </SpotlightCard>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.2} className="h-full">
                    <div onClick={() => setActiveTab('completed')} className="h-full cursor-pointer">
                        <SpotlightCard className="h-full bg-white border-gray-200" spotlightColor="rgba(234, 179, 8, 0.2)">
                            <div className="flex flex-row items-center justify-between pb-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Pending Confirmation
                                </h3>
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">
                                    <CountUp
                                        from={0}
                                        to={stats.pending}
                                        separator=","
                                        direction="up"
                                        duration={1}
                                        className="count-up-text"
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Awaiting your confirmation</p>
                            </div>
                        </SpotlightCard>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.3} className="h-full">
                    <div onClick={() => setActiveTab('confirmed')} className="h-full cursor-pointer">
                        <SpotlightCard className="h-full bg-white border-gray-200" spotlightColor="rgba(34, 197, 94, 0.2)">
                            <div className="flex flex-row items-center justify-between pb-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Confirmed Jobs
                                </h3>
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">
                                    <CountUp
                                        from={0}
                                        to={stats.completed}
                                        separator=","
                                        direction="up"
                                        duration={1}
                                        className="count-up-text"
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Successfully finished</p>
                            </div>
                        </SpotlightCard>
                    </div>
                </ScrollReveal>
             </div>

            {/* Jobs List */}
            <ScrollReveal delay={0.4}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center border-b border-gray-200 border-b-2 pb-2">Your Jobs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-6 bg-transparent p-1 gap-2">
                                <TabsTrigger 
                                    value="all"
                                    className="data-[state=active]:bg-blue-500/10 data-[state=active]:backdrop-blur-sm data-[state=active]:text-blue-600 data-[state=active]:border-blue-200/50 data-[state=active]:border shadow-none rounded-lg transition-all duration-300"
                                >
                                    All
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="active"
                                    className="data-[state=active]:bg-blue-500/10 data-[state=active]:backdrop-blur-sm data-[state=active]:text-blue-600 data-[state=active]:border-blue-200/50 data-[state=active]:border shadow-none rounded-lg transition-all duration-300"
                                >
                                    Active
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="pending"
                                    className="data-[state=active]:bg-yellow-500/10 data-[state=active]:backdrop-blur-sm data-[state=active]:text-yellow-600 data-[state=active]:border-yellow-200/50 data-[state=active]:border shadow-none rounded-lg transition-all duration-300"
                                >
                                    Pending
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="completed"
                                    className="data-[state=active]:bg-orange-500/10 data-[state=active]:backdrop-blur-sm data-[state=active]:text-orange-600 data-[state=active]:border-orange-200/50 data-[state=active]:border shadow-none rounded-lg transition-all duration-300"
                                >
                                    Completed
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="confirmed"
                                    className="data-[state=active]:bg-green-500/10 data-[state=active]:backdrop-blur-sm data-[state=active]:text-green-600 data-[state=active]:border-green-200/50 data-[state=active]:border shadow-none rounded-lg transition-all duration-300"
                                >
                                    Confirmed
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="disputed"
                                    className="data-[state=active]:bg-red-500/10 data-[state=active]:backdrop-blur-sm data-[state=active]:text-red-600 data-[state=active]:border-red-200/50 data-[state=active]:border shadow-none rounded-lg transition-all duration-300"
                                >
                                    Disputed
                                </TabsTrigger>
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
                                    <JobList jobs={jobs} />
                                )}
                            </TabsContent>
    
                            <TabsContent value="active" className="mt-6">
                                {filterJobs('active').length === 0 ? (
                                    <EmptyState
                                        title="No active jobs"
                                        description="You don't have any jobs in progress at the moment"
                                    />
                                ) : (
                                    <JobList jobs={filterJobs('active')} />
                                )}
                            </TabsContent>
    
                            <TabsContent value="pending" className="mt-6">
                                {filterJobs('pending').length === 0 ? (
                                    <EmptyState
                                        title="No pending jobs"
                                        description="You don't have any open jobs waiting for providers"
                                    />
                                ) : (
                                    <JobList jobs={filterJobs('pending')} />
                                )}
                            </TabsContent>

                            <TabsContent value="completed" className="mt-6">
                                {filterJobs('completed').length === 0 ? (
                                    <EmptyState
                                        title="No completed jobs"
                                        description="You don't have any jobs marked as completed by providers"
                                    />
                                ) : (
                                    <JobList jobs={filterJobs('completed')} />
                                )}
                            </TabsContent>
    
                            <TabsContent value="confirmed" className="mt-6">
                                {filterJobs('confirmed').length === 0 ? (
                                    <EmptyState
                                        title="No confirmed jobs"
                                        description="Your confirmed jobs will appear here"
                                    />
                                ) : (
                                    <JobList jobs={filterJobs('confirmed')} />
                                )}
                            </TabsContent>

                            <TabsContent value="disputed" className="mt-6">
                                {filterJobs('disputed').length === 0 ? (
                                    <EmptyState
                                        title="No disputed jobs"
                                        description="Jobs with reported issues will appear here"
                                    />
                                ) : (
                                    <JobList jobs={filterJobs('disputed')} />
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </ScrollReveal>
        </div>
    );
};
