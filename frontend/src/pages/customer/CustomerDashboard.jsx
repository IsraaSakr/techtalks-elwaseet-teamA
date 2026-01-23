import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
    PlusCircle, 
    Briefcase, 
    Clock, 
    CheckCircle, 
    ChevronLeft, 
    ChevronRight,
    FileText,
    DollarSign
} from 'lucide-react';
import { JobCard } from '../../components/shared/JobCard';
import SpotlightCard from '../../components/ui/SpotlightCard';
import CountUp from '../../components/ui/CountUp';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/EmptyState';
import { jobsAPI } from '../../lib/api';
import { ROUTES, JOB_STATUS } from '../../lib/constants';
import ScrollReveal from '../../components/ui/ScrollReveal';

/**
 * Status filter options matching the specification
 * Maps tab values to API status parameters
 */
const STATUS_FILTERS = {
    all: null,                    // No filter - show all jobs
    open: 'OPEN',                 // Accepting applications
    in_progress: 'IN_PROGRESS',   // Work in progress
    completed: 'COMPLETED',       // Provider marked complete, awaiting confirmation
    confirmed: 'CONFIRMED',       // Customer confirmed completion
    disputed: 'DISPUTED'          // Has issues
};

/**
 * Page size for pagination
 */
const PAGE_SIZE = 10;

/**
 * Format relative time (e.g., "2 days ago")
 */
const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    
    return date.toLocaleDateString();
};

/**
 * Job List Component with Grid Layout
 */
const JobList = ({ jobs, onViewDetails }) => {
    if (!jobs || jobs.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
                <JobCard
                    key={job.jobId || job.id}
                    job={{
                        ...job,
                        id: job.jobId || job.id,
                        postedAtRelative: formatRelativeTime(job.postedAt || job.createdAt)
                    }}
                    onViewDetails={onViewDetails}
                />
            ))}
        </div>
    );
};

/**
 * Pagination Component
 */
const Pagination = ({ currentPage, totalPages, onPageChange, disabled }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-gray-100">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={disabled || currentPage === 0}
                className="flex items-center gap-1"
            >
                <ChevronLeft className="w-4 h-4" />
                Previous
            </Button>
            
            <span className="text-sm text-gray-600">
                Page <span className="font-semibold">{currentPage + 1}</span> of <span className="font-semibold">{totalPages}</span>
            </span>
            
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={disabled || currentPage >= totalPages - 1}
                className="flex items-center gap-1"
            >
                Next
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    );
};

/**
 * Customer Dashboard Component
 * 
 * Displays customer's jobs with:
 * - Stats overview (total, active, completed)
 * - Filter tabs (All, Open, In Progress, Completed, Confirmed, Disputed)
 * - Paginated job list
 * - Server-side filtering and pagination
 */
export const CustomerDashboard = () => {
    const navigate = useNavigate();

    // Filter and pagination state
    const [activeTab, setActiveTab] = useState('all');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Data state
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Stats state - fetched separately to show accurate totals
    const [stats, setStats] = useState({
        total: 0,
        active: 0,      // OPEN + IN_PROGRESS
        pending: 0,     // COMPLETED (awaiting confirmation)
        confirmed: 0,   // CONFIRMED
    });

    /**
     * Fetch jobs with current filters and pagination
     */
    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Build query parameters
            const params = {
                page,
                size: PAGE_SIZE,
                sortBy: 'postedAt',
                sortDir: 'desc'
            };

            // Add status filter if not "all"
            const statusFilter = STATUS_FILTERS[activeTab];
            if (statusFilter) {
                params.status = statusFilter;
            }

            // Fetch jobs from API
            const response = await jobsAPI.getMyJobs(params);
            
            // Handle response - API returns paginated data
            const data = response.data || response;
            
            if (data.content) {
                // Paginated response format
                setJobs(data.content);
                setTotalPages(data.totalPages || 1);
                setTotalElements(data.totalElements || data.content.length);
            } else if (Array.isArray(data.jobs)) {
                // Legacy format: { jobs: [...] }
                setJobs(data.jobs);
                setTotalPages(1);
                setTotalElements(data.jobs.length);
            } else if (Array.isArray(data)) {
                // Simple array format
                setJobs(data);
                setTotalPages(1);
                setTotalElements(data.length);
            } else {
                setJobs([]);
                setTotalPages(0);
                setTotalElements(0);
            }
        } catch (err) {
            console.error('Failed to load jobs:', err);
            setError('Failed to load jobs. Please try again.');
            setJobs([]);
        } finally {
            setLoading(false);
        }
    }, [activeTab, page]);

    /**
     * Fetch stats (all jobs without pagination to calculate totals)
     */
    const fetchStats = useCallback(async () => {
        try {
            // Fetch all jobs without pagination for accurate stats
            // Or use a dedicated stats endpoint if available
            const response = await jobsAPI.getMyJobs({ size: 1000 });
            const data = response.data || response;
            const allJobs = data.content || data.jobs || data || [];

            // Calculate stats
            const total = allJobs.length;
            const active = allJobs.filter(j => 
                j.status === JOB_STATUS.OPEN || j.status === JOB_STATUS.IN_PROGRESS
            ).length;
            const pending = allJobs.filter(j => 
                j.status === JOB_STATUS.COMPLETED
            ).length;
            const confirmed = allJobs.filter(j => 
                j.status === JOB_STATUS.CONFIRMED
            ).length;

            setStats({ total, active, pending, confirmed });
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    }, []);

    /**
     * Load jobs when filter or page changes
     */
    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    /**
     * Load stats on initial mount
     */
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    /**
     * Handle tab change - reset to first page
     */
    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        setPage(0); // Reset to first page when filter changes
    };

    /**
     * Handle page change
     */
    const handlePageChange = (newPage) => {
        setPage(newPage);
        // Scroll to top of jobs list
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    /**
     * Navigate to job details
     */
    const handleViewDetails = (jobId) => {
        navigate(ROUTES.CUSTOMER_JOB_DETAILS(jobId));
    };

    /**
     * Render current tab content
     */
    const renderContent = () => {
        if (loading) {
            return (
                <div className="py-12">
                    <LoadingSpinner />
                </div>
            );
        }

        if (error) {
            return (
                <EmptyState
                    title="Error loading jobs"
                    description={error}
                    action={
                        <Button onClick={fetchJobs}>
                            Try Again
                        </Button>
                    }
                />
            );
        }

        if (jobs.length === 0) {
            // Different empty states based on active tab
            if (activeTab === 'all') {
                return (
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
                );
            }

            const emptyMessages = {
                open: { title: "No open jobs", description: "You don't have any jobs waiting for providers" },
                in_progress: { title: "No active jobs", description: "You don't have any jobs in progress" },
                completed: { title: "No completed jobs", description: "Jobs marked complete by providers will appear here" },
                confirmed: { title: "No confirmed jobs", description: "Your confirmed jobs will appear here" },
                disputed: { title: "No disputed jobs", description: "Jobs with reported issues will appear here" }
            };

            const message = emptyMessages[activeTab] || { title: "No jobs found", description: "" };

            return (
                <EmptyState
                    title={message.title}
                    description={message.description}
                />
            );
        }

        return (
            <>
                <JobList jobs={jobs} onViewDetails={handleViewDetails} />
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    disabled={loading}
                />
            </>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header with Post Job Button */}
            <ScrollReveal>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-8">
                    <div className="text-center sm:text-left">
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">Dashboard</h1>
                        <p className="text-lg text-gray-600 mt-2">Manage your jobs and track progress from one central hub</p>
                    </div>
                    <Link to={ROUTES.POST_JOB}>
                        <Button size="lg" className="w-full sm:w-auto">
                            <PlusCircle className="mr-2 w-5 h-5" />
                            Post New Job
                        </Button>
                    </Link>
                </div>
            </ScrollReveal>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {/* Total Jobs */}
                <ScrollReveal delay={0.1} className="h-full">
                    <div onClick={() => handleTabChange('all')} className="h-full cursor-pointer">
                        <SpotlightCard className="h-full bg-white border-gray-200" spotlightColor="rgba(107, 114, 128, 0.2)">
                            <div className="flex flex-row items-center justify-between pb-2">
                                <h3 className="text-sm font-medium text-gray-500">Total Jobs</h3>
                                <FileText className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">
                                    <CountUp from={0} to={stats.total} separator="," direction="up" duration={1} />
                                </div>
                                <p className="text-sm text-gray-500 mt-1">All time posted</p>
                            </div>
                        </SpotlightCard>
                    </div>
                </ScrollReveal>

                {/* Active Jobs */}
                <ScrollReveal delay={0.2} className="h-full">
                    <div onClick={() => handleTabChange('open')} className="h-full cursor-pointer">
                        <SpotlightCard className="h-full bg-white border-gray-200" spotlightColor="rgba(59, 130, 246, 0.2)">
                            <div className="flex flex-row items-center justify-between pb-2">
                                <h3 className="text-sm font-medium text-gray-500">Active Jobs</h3>
                                <Briefcase className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">
                                    <CountUp from={0} to={stats.active} separator="," direction="up" duration={1} />
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Open + In Progress</p>
                            </div>
                        </SpotlightCard>
                    </div>
                </ScrollReveal>

                {/* Pending Confirmation */}
                <ScrollReveal delay={0.3} className="h-full">
                    <div onClick={() => handleTabChange('completed')} className="h-full cursor-pointer">
                        <SpotlightCard className="h-full bg-white border-gray-200" spotlightColor="rgba(234, 179, 8, 0.2)">
                            <div className="flex flex-row items-center justify-between pb-2">
                                <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">
                                    <CountUp from={0} to={stats.pending} separator="," direction="up" duration={1} />
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Awaiting confirmation</p>
                            </div>
                        </SpotlightCard>
                    </div>
                </ScrollReveal>

                {/* Confirmed Jobs */}
                <ScrollReveal delay={0.4} className="h-full">
                    <div onClick={() => handleTabChange('confirmed')} className="h-full cursor-pointer">
                        <SpotlightCard className="h-full bg-white border-gray-200" spotlightColor="rgba(34, 197, 94, 0.2)">
                            <div className="flex flex-row items-center justify-between pb-2">
                                <h3 className="text-sm font-medium text-gray-500">Confirmed</h3>
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">
                                    <CountUp from={0} to={stats.confirmed} separator="," direction="up" duration={1} />
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Successfully finished</p>
                            </div>
                        </SpotlightCard>
                    </div>
                </ScrollReveal>
            </div>

            {/* Jobs List with Tabs */}
            <ScrollReveal delay={0.5}>
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <CardTitle className="text-2xl font-bold">Your Jobs</CardTitle>
                            {totalElements > 0 && (
                                <span className="text-sm text-gray-500">
                                    Showing {jobs.length} of {totalElements} jobs
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Filter Tabs */}
                        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 bg-transparent p-1 gap-1 sm:gap-2 mb-6">
                                <TabsTrigger 
                                    value="all"
                                    className="data-[state=active]:bg-gray-500/10 data-[state=active]:text-gray-700 data-[state=active]:border-gray-300 data-[state=active]:border rounded-lg transition-all text-xs sm:text-sm"
                                >
                                    All
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="open"
                                    className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-600 data-[state=active]:border-blue-300 data-[state=active]:border rounded-lg transition-all text-xs sm:text-sm"
                                >
                                    Open
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="in_progress"
                                    className="data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-600 data-[state=active]:border-purple-300 data-[state=active]:border rounded-lg transition-all text-xs sm:text-sm"
                                >
                                    In Progress
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="completed"
                                    className="data-[state=active]:bg-yellow-500/10 data-[state=active]:text-yellow-600 data-[state=active]:border-yellow-300 data-[state=active]:border rounded-lg transition-all text-xs sm:text-sm"
                                >
                                    Completed
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="confirmed"
                                    className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-600 data-[state=active]:border-green-300 data-[state=active]:border rounded-lg transition-all text-xs sm:text-sm"
                                >
                                    Confirmed
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="disputed"
                                    className="data-[state=active]:bg-red-500/10 data-[state=active]:text-red-600 data-[state=active]:border-red-300 data-[state=active]:border rounded-lg transition-all text-xs sm:text-sm"
                                >
                                    Disputed
                                </TabsTrigger>
                            </TabsList>

                            {/* Content - same for all tabs, data changes based on API call */}
                            <div className="mt-4">
                                {renderContent()}
                            </div>
                        </Tabs>
                    </CardContent>
                </Card>
            </ScrollReveal>
        </div>
    );
};