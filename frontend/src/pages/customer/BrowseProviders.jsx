import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Search } from 'lucide-react';
import { ProviderCard } from '../../components/shared/ProviderCard';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/EmptyState';
import { SERVICE_CATEGORIES, ROUTES } from '../../lib/constants';
import { mockProviders } from '../../lib/mockData';

export const BrowseProviders = () => {
    console.log("Rendering BrowseProviders - TEST MODE (NO ProviderCard)");
    const navigate = useNavigate();
    const [providers] = useState(mockProviders);
    const [loading] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        category: 'all',
        location: '',
    });

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleViewProfile = (providerId) => {
        navigate(ROUTES.PROVIDER_PROFILE(providerId));
    };

    const filteredProviders = providers.filter(provider => {
        if (filters.search && (!provider.fullName || !provider.fullName.toLowerCase().includes(filters.search.toLowerCase()))) {
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

    return (
        <div className="space-y-6" >
            {/* Header */}
            <div className="flex flex-col items-center justify-center gap-2 text-center py-8">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">Browse Providers</h1>
                <p className="text-lg text-gray-600 max-w-2xl">Find trusted service providers in your area</p>
            </div>

            {/* Filters & Results */}
            <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center border-b-2 border-gray-200 pb-2">Filter Providers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="flex-1 space-y-2">
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
                            <div className="flex-1 space-y-2">
                                <Input
                                    placeholder="Filter by location..."
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                />
                            </div>
                        </div>

                        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => handleFilterChange('category', value)}>
                            <div className="overflow-x-auto pb-4 scrollbar-hide">
                                <TabsList className="bg-transparent p-1 gap-2 flex w-max">
                                    <TabsTrigger 
                                        value="all"
                                        className="data-[state=active]:bg-primary/10 data-[state=active]:backdrop-blur-sm data-[state=active]:text-primary data-[state=active]:border-primary/50 data-[state=active]:border shadow-none rounded-lg transition-all duration-300"
                                    >
                                        All
                                    </TabsTrigger>
                                    {SERVICE_CATEGORIES.map(category => (
                                        <TabsTrigger 
                                            key={category}
                                            value={category}
                                            className="data-[state=active]:bg-primary/10 data-[state=active]:backdrop-blur-sm data-[state=active]:text-primary data-[state=active]:border-primary/50 data-[state=active]:border shadow-none rounded-lg transition-all duration-300 transform"
                                        >
                                            {category}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>

                            <div className="mt-6">
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
                                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
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
                        </Tabs>
                    </CardContent>
                </Card>
        </div>
    );
};
