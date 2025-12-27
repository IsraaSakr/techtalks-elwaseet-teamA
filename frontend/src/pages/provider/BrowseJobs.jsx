import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Search, MapPin, DollarSign, Calendar, Briefcase } from 'lucide-react';
import { JobCard } from '../../components/shared/JobCard';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/EmptyState';
import { jobsAPI } from '../../lib/api';
import { SERVICE_CATEGORIES, ROUTES, JOB_STATUS } from '../../lib/constants';
//import { formatCurrency, formatDate } from '../../lib/utils';


export const BrowseJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        location: '',
        budgetMin: '',
        budgetMax: '',
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await jobsAPI.getAll({ status: JOB_STATUS.OPEN });
            setJobs(data.jobs || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const filteredJobs = jobs.filter(job => {
        if (filters.search && !job.title.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
        }
        if (filters.category && filters.category !== 'all' && job.category !== filters.category) {
            return false;
        }
        if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
            return false;
        }
        if (filters.budgetMin && job.budgetMax < parseFloat(filters.budgetMin)) {
            return false;
        }
        if (filters.budgetMax && job.budgetMin > parseFloat(filters.budgetMax)) {
            return false;
        }
        return true;
    });

    const handleViewJob = (jobId) => {
        navigate(ROUTES.PROVIDER_JOB_DETAILS(jobId));
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
                <p className="text-gray-600 mt-1">Find jobs that match your skills and availability</p>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filter Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search jobs..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Category</label>
                            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All categories</SelectItem>
                                    {SERVICE_CATEGORIES.map(category => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Location</label>
                            <Input
                                placeholder="Enter location..."
                                value={filters.location}
                                onChange={(e) => handleFilterChange('location', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Min Budget</label>
                            <Input
                                type="number"
                                placeholder="$0"
                                value={filters.budgetMin}
                                onChange={(e) => handleFilterChange('budgetMin', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Max Budget</label>
                            <Input
                                type="number"
                                placeholder="$1000"
                                value={filters.budgetMax}
                                onChange={(e) => handleFilterChange('budgetMax', e.target.value)}
                            />
                        </div>

                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={() => setFilters({ search: '', category: '', location: '', budgetMin: '', budgetMax: '' })}
                                className="w-full"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600">
                        {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                    </p>
                </div>

                {filteredJobs.length === 0 ? (
                    <EmptyState
                        icon="search"
                        title="No jobs found"
                        description="Try adjusting your filters to see more results"
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobs.map(job => (
                            <JobCard
                                key={job.id}
                                job={job}
                                onViewDetails={handleViewJob}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
