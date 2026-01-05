import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Search, Filter, Briefcase, Calendar, MapPin, DollarSign, Eye } from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';
import { ROUTES } from '../../lib/constants';
// import ScrollReveal from '../../components/ui/ScrollReveal';

import { mockJobs } from '../../lib/mockData';

export const AdminJobsList = () => {
    const navigate = useNavigate();

    // Mock jobs data - using centralized mock data
    const [jobs] = useState(mockJobs);

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'IN_PROGRESS':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'COMPLETED':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleViewJob = (jobId) => {
        // Use the dedicated ADMIN_JOB_DETAILS route
        navigate(ROUTES.ADMIN_JOB_DETAILS(jobId));
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header */}
            {/* <ScrollReveal> */}
            <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Jobs Management</h1>
                        <p className="text-gray-600 mt-1">Monitor and manage service requests</p>
                    </div>
                    <Button variant="outline" className="shadow-sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter Jobs
                    </Button>
                </div>
            </div>
            {/* </ScrollReveal> */}

            {/* Jobs List */}
            {/* <ScrollReveal delay={0.2}> */}
            <div>
                <Card className="border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
                    <CardHeader className="border-b bg-gray-50/50">
                        <div className="flex items-center justify-between">
                            <CardTitle>Active & Recent Jobs</CardTitle>
                            <div className="relative w-64 hidden md:block">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    placeholder="Search jobs..."
                                    className="w-full pl-8 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {jobs.map((job) => (
                                <div 
                                    key={job.id} 
                                    onClick={() => handleViewJob(job.id)}
                                    className="group flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
                                >
                                    <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                                                {job.title}
                                            </h3>
                                            <Badge className={`${getStatusColor(job.status)} px-2 py-0.5 text-xs font-medium border`}>
                                                {job.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1.5">
                                                <span className="font-medium text-gray-700">Client:</span> {job.customer}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <span className="font-medium text-gray-700">Provider:</span> {job.provider}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                                {job.location}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex md:flex-col items-center md:items-end justify-between gap-2 pl-4 md:border-l border-gray-100 min-w-[120px]">
                                        <div className="font-bold text-gray-900 flex items-center">
                                            <DollarSign className="w-4 h-4 text-green-600" />
                                            {formatCurrency(job.amount)}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(job.date)}
                                        </div>
                                        {/* Mobile-only view button logic could go here if needed, but the whole card is clickable now */}
                                        <div className="hidden md:flex mt-1">
                                            <Button size="sm" variant="ghost" className="h-6 px-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                                <Eye className="w-3 h-3 mr-1" />
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* </ScrollReveal> */}
        </div>
    );
};
