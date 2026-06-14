import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, DollarSign, Zap, ChevronLeft, ChevronRight, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/EmptyState';
import { jobsAPI } from '../../lib/api';
import { formatRelativeTime } from '../../lib/utils';
import { ROUTES } from '../../lib/constants';

const LOCATIONS = ['BEIRUT', 'TRIPOLI', 'SIDON', 'TYRE', 'JOUNIEH', 'ZAHLE', 'BAALBEK'];
const URGENCY_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'IMMEDIATE'];

const URGENCY_COLORS = {
    LOW: 'bg-gray-100 text-gray-700',
    MEDIUM: 'bg-blue-100 text-blue-700',
    HIGH: 'bg-orange-100 text-orange-700',
    IMMEDIATE: 'bg-red-100 text-red-700',
};

const JobBrowseCard = ({ job, onClick }) => {
    const urgencyColor = URGENCY_COLORS[job.urgency] || 'bg-gray-100 text-gray-700';

    return (
        <Card
            onClick={() => onClick(job.jobId)}
            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border border-gray-200"
        >
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2">
                        {job.title}
                    </h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${urgencyColor}`}>
                        {job.urgency}
                    </span>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {job.description}
                </p>

                <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-green-600" />
                        ${job.budgetMin} – ${job.budgetMax}
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        {job.location}
                    </span>
                    {job.category && (
                        <span className="flex items-center gap-1 text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full text-xs">
                            {job.category}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{job.applicationCount ?? 0} applications</span>
                    <span>{job.postedAt ? formatRelativeTime(job.postedAt) : 'Recently posted'}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export const BrowseJobsPage = () => {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        search: '',
        location: '',
        urgency: '',
        minBudget: '',
        maxBudget: '',
        sortBy: 'postedAt',
        sortDir: 'desc',
        page: 0,
        size: 12,
    });

    const fetchJobs = useCallback(async () => {
        try {
            setLoading(true);
            const params = {};

            if (filters.location) params.location = filters.location;
            if (filters.urgency) params.urgency = filters.urgency;
            if (filters.minBudget) params.minBudget = filters.minBudget;
            if (filters.maxBudget) params.maxBudget = filters.maxBudget;
            params.page = filters.page;
            params.size = filters.size;
            params.sortBy = filters.sortBy;
            params.sortDir = filters.sortDir;

            const data = await jobsAPI.getAll(params);
            let jobList = data.content || [];

            // Client-side search filter (backend doesn't support text search)
            if (filters.search.trim()) {
                const q = filters.search.toLowerCase();
                jobList = jobList.filter(
                    j =>
                        j.title?.toLowerCase().includes(q) ||
                        j.description?.toLowerCase().includes(q) ||
                        j.category?.toLowerCase().includes(q)
                );
            }

            setJobs(jobList);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 0 }));
    };

    const clearFilters = () => {
        setFilters(prev => ({
            ...prev,
            search: '',
            location: '',
            urgency: '',
            minBudget: '',
            maxBudget: '',
            page: 0,
        }));
    };

    const hasActiveFilters = filters.location || filters.urgency || filters.minBudget || filters.maxBudget;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Browse Jobs</h1>
                <p className="text-sm text-gray-500">
                    {totalElements > 0 ? `${totalElements} jobs available` : 'Explore available jobs'}
                </p>
            </div>

            {/* Search + Filter Toggle */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search by title, description, or category..."
                        value={filters.search}
                        onChange={e => handleFilterChange('search', e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(p => !p)}
                    className={showFilters || hasActiveFilters ? 'border-blue-500 text-blue-600' : ''}
                >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                        <span className="ml-1.5 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            !
                        </span>
                    )}
                </Button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Location */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">Location</label>
                            <select
                                value={filters.location}
                                onChange={e => handleFilterChange('location', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 bg-white"
                            >
                                <option value="">All Locations</option>
                                {LOCATIONS.map(l => (
                                    <option key={l} value={l}>{l}</option>
                                ))}
                            </select>
                        </div>

                        {/* Urgency */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">Urgency</label>
                            <select
                                value={filters.urgency}
                                onChange={e => handleFilterChange('urgency', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 bg-white"
                            >
                                <option value="">Any Urgency</option>
                                {URGENCY_LEVELS.map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>

                        {/* Min Budget */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">Min Budget ($)</label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={filters.minBudget}
                                onChange={e => handleFilterChange('minBudget', e.target.value)}
                                className="text-sm"
                            />
                        </div>

                        {/* Max Budget */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">Max Budget ($)</label>
                            <Input
                                type="number"
                                placeholder="Any"
                                value={filters.maxBudget}
                                onChange={e => handleFilterChange('maxBudget', e.target.value)}
                                className="text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-medium text-gray-600">Sort by:</label>
                            <select
                                value={`${filters.sortBy},${filters.sortDir}`}
                                onChange={e => {
                                    const [sortBy, sortDir] = e.target.value.split(',');
                                    setFilters(prev => ({ ...prev, sortBy, sortDir, page: 0 }));
                                }}
                                className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white"
                            >
                                <option value="postedAt,desc">Newest First</option>
                                <option value="postedAt,asc">Oldest First</option>
                                <option value="budgetMin,asc">Budget: Low to High</option>
                                <option value="budgetMax,desc">Budget: High to Low</option>
                            </select>
                        </div>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                                <X className="w-3 h-3" /> Clear filters
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Results */}
            {loading ? (
                <LoadingSpinner />
            ) : jobs.length === 0 ? (
                <EmptyState
                    title="No jobs found"
                    description="Try adjusting your filters or search terms."
                    action={
                        hasActiveFilters && (
                            <Button variant="outline" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        )
                    }
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {jobs.map(job => (
                            <JobBrowseCard
                                key={job.jobId}
                                job={job}
                                onClick={(id) => navigate(ROUTES.BROWSE_JOB_DETAILS(id))}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={filters.page === 0}
                                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </Button>
                            <span className="text-sm text-gray-600">
                                Page {filters.page + 1} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={filters.page >= totalPages - 1}
                                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
