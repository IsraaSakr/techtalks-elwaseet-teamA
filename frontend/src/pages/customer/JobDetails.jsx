import { useState, useEffect } from 'react';
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
import { ROUTES } from '../../lib/constants';

export const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
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
    };

    const handleAcceptApplication = async (providerId) => {
        try {
            await applicationsAPI.accept(id, providerId);
            fetchJobDetails();
        } catch (error) {
            console.error('Error accepting application:', error);
        }
    };

    const handleConfirmCompletion = async () => {
        try {
            await jobsAPI.confirm(id);
            fetchJobDetails();
        } catch (error) {
            console.error('Error confirming completion:', error);
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
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
                        <p className="text-gray-700">{job.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-gray-700">
                            <Badge variant="secondary">{job.category}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <DollarSign className="w-4 h-4" />
                            <span>{formatCurrency(job.budgetMin)} - {formatCurrency(job.budgetMax)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4" />
                            <span>Posted {formatDate(job.createdAt)}</span>
                        </div>
                    </div>

                    {job.photos && job.photos.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Photos</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {job.photos.map((photo, index) => (
                                    <img
                                        key={index}
                                        src={photo}
                                        alt={`Job photo ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg"
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
                        <div className="text-center py-8 text-gray-500">
                            No applications yet
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {applications.map((app) => (
                                <div
                                    key={app.id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4 flex-1">
                                            <Avatar>
                                                <AvatarFallback>
                                                    <User className="w-5 h-5" />
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">Provider #{app.providerId}</h4>
                                                <p className="text-sm text-gray-600 mt-1">{app.message}</p>

                                                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-700">
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="w-4 h-4" />
                                                        <span className="font-semibold">{formatCurrency(app.quote)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{app.availability}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {app.status === 'PENDING' && job.status === 'OPEN' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleAcceptApplication(app.providerId)}
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Accept
                                                    </Button>
                                                    <Button size="sm" variant="outline">
                                                        <XCircle className="w-4 h-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                            {app.status === 'ACCEPTED' && (
                                                <Badge className="bg-green-100 text-green-800">Accepted</Badge>
                                            )}
                                            {app.status === 'REJECTED' && (
                                                <Badge className="bg-red-100 text-red-800">Rejected</Badge>
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
            {job.status === 'COMPLETED' && (
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900">Job Completed</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    The provider has marked this job as completed. Please confirm to release payment.
                                </p>
                            </div>
                            <Button onClick={handleConfirmCompletion}>
                                Confirm & Pay
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate(ROUTES.CUSTOMER_DASHBOARD)}>
                    Back to Dashboard
                </Button>
            </div>
        </div>
    );
};
