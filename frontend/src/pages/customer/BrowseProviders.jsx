import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Search } from 'lucide-react';
import { ProviderCard } from '../../components/shared/ProviderCard';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/EmptyState';
import { providersAPI } from '../../lib/api';
import { SERVICE_CATEGORIES, ROUTES } from '../../lib/constants';

export const BrowseProviders = () => {
    const navigate = useNavigate();
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        location: '',
    });

    useEffect(() => {
        fetchProviders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchProviders = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching providers...');
            const data = await providersAPI.getAll();
            console.log('Providers data:', data);
            setProviders(data.providers || []);
        } catch (error) {
            console.error('Error fetching providers:', error);
            setError(error.message || 'Failed to load providers');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleViewProfile = (providerId) => {
        navigate(ROUTES.PROVIDER_PROFILE(providerId));
    };

    const filteredProviders = providers.filter(provider => {
        if (filters.search && !provider.fullName.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
        }
        if (filters.category && filters.category !== 'all' && !provider.services?.includes(filters.category)) {
            return false;
        }
        if (filters.location && !provider.location.toLowerCase().includes(filters.location.toLowerCase())) {
            return false;
        }
        return true;
    });

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-red-600">Error</h2>
                <p className="text-gray-600 mt-2">{error}</p>
                <button
                    onClick={fetchProviders}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Browse Providers</h1>
                <p className="text-gray-600 mt-1">Find trusted service providers in your area</p>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filter Providers</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search providers..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Service Category</label>
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
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600">
                        {filteredProviders.length} {filteredProviders.length === 1 ? 'provider' : 'providers'} found
                    </p>
                </div>

                {filteredProviders.length === 0 ? (
                    <EmptyState
                        icon="search"
                        title="No providers found"
                        description="Try adjusting your filters to see more results"
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProviders.map(provider => (
                            <ProviderCard
                                key={provider.id}
                                provider={provider}
                                onViewProfile={handleViewProfile}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
