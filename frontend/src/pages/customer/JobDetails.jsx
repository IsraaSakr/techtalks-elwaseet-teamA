import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { MapPin, DollarSign, Calendar, User, CheckCircle, XCircle } from 'lucide-react';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { jobsAPI, applicationsAPI } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import { ROUTES, USER_ROLES } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';

export const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchJobDetails = useCallback(async () => {
        try {
            setLoading(true);
            const [jobData, appsData] = await Promise.all([
                jobsAPI.getById(id),
                applicationsAPI.getByJob(id)
            ]);
            setJob(jobData.job);
            setApplications(appsData.applications || []);
        } catch (error) {
            console.error('Error fetching job details:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchJobDetails();
    }, [fetchJobDetails]);

    const handleAcceptApplication = async (providerId) => {
        try {
            await applicationsAPI.accept(id, providerId);
            fetchJobDetails();
        } catch (error) {
            console.error('Error accepting application:', error);
        }
    };


    if (loading) {
        return <LoadingSpinner />;
    }

    if (!job) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
                <Button onClick={() => navigate(ROUTES.CUSTOMER_DASHBOARD)} className="mt-4">
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{job.title}</h1>
                    <p className="text-gray-600 mt-1">Job Details</p>
                </div>
                <StatusBadge status={job.status} type="job" />
            </div>

            {/* Job Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Job Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-700 leading-relaxed">{job.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="flex items-center gap-2 text-gray-700">
                            <Badge variant="secondary" className="px-3 py-1">{job.category}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span>{formatCurrency(job.budgetMin)} - {formatCurrency(job.budgetMax)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>Posted {formatDate(job.createdAt)}</span>
                        </div>
                    </div>

                    {job.photos && job.photos.length > 0 && (
                        <div className="pt-4">
                            <h3 className="font-semibold text-gray-900 mb-3">Photos</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {job.photos.map((photo, index) => (
                                    <img
                                        key={index}
                                        src={photo}
                                        alt={`Job photo ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Applications */}
            <Card>
                <CardHeader>
                    <CardTitle>Applications ({applications.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {applications.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <p className="text-gray-500">No applications received yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {applications.map((app) => (
                                <div
                                    key={app.id}
                                    className="border rounded-lg p-5 hover:bg-gray-50 transition-colors bg-white shadow-sm"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4 flex-1">
                                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                                    <User className="w-5 h-5" />
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-gray-900">Provider #{app.providerId}</h4>
                                                    <span className="text-xs text-gray-500">• {formatDate(app.createdAt)}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{app.message}</p>

                                                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                                                    <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                                                        <DollarSign className="w-3.5 h-3.5" />
                                                        <span className="font-semibold">{formatCurrency(app.quote)}</span>
                                                    </Badge>
                                                    <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        <span>{app.availability}</span>
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pl-4">
                                            {/* Only show actions if user is NOT an admin (and logic holds for customer) */}
                                            {app.status === 'PENDING' && job.status === 'OPEN' && user?.role !== USER_ROLES.ADMIN && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleAcceptApplication(app.providerId)}
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Accept
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                        <XCircle className="w-4 h-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                            {app.status === 'ACCEPTED' && (
                                                <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">Accepted</Badge>
                                            )}
                                            {app.status === 'REJECTED' && (
                                                <Badge className="bg-red-100 text-red-800 border-red-200 px-3 py-1">Rejected</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Actions */}
            {job.status === 'COMPLETED' && user?.role !== USER_ROLES.ADMIN && (
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-blue-900">Job Completed</h3>
                                <p className="text-sm text-blue-700 mt-1">
                                    The provider has marked this job as completed. Please confirm to release payment.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    variant="destructive" 
                                    onClick={() => navigate(ROUTES.CUSTOMER_JOB_DISPUTE(id))}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Reject
                                </Button>
                                <Button onClick={() => navigate(ROUTES.CUSTOMER_RATE_PROVIDER(id))} className="bg-blue-600 hover:bg-blue-700">
                                    Confirm & Pay
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate(user?.role === USER_ROLES.ADMIN ? ROUTES.ADMIN_DASHBOARD : ROUTES.CUSTOMER_DASHBOARD)}>
                    Back to Dashboard
                </Button>
            </div>
        </div>
    );
};
