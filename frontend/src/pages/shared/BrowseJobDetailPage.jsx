import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Clock, User, Tag, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { jobsAPI } from '../../lib/api';
import { formatRelativeTime } from '../../lib/utils';

const URGENCY_COLORS = {
    LOW: 'bg-gray-100 text-gray-700 border-gray-200',
    MEDIUM: 'bg-blue-100 text-blue-700 border-blue-200',
    HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
    IMMEDIATE: 'bg-red-100 text-red-700 border-red-200',
};

const STATUS_COLORS = {
    OPEN: 'bg-green-100 text-green-700',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
    CONFIRMED: 'bg-emerald-100 text-emerald-700',
    DISPUTED: 'bg-red-100 text-red-700',
};

export const BrowseJobDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                // GET /api/jobs/{id} returns the job object directly
                const data = await jobsAPI.getById(id);
                setJob(data);
            } catch (err) {
                setError('Job not found or you do not have permission to view it.');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
                <AlertCircle className="w-12 h-12 text-red-400" />
                <p className="text-gray-600">{error}</p>
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
                </Button>
            </div>
        );
    }

    if (!job) return null;

    const urgencyClass = URGENCY_COLORS[job.urgency] || 'bg-gray-100 text-gray-700 border-gray-200';
    const statusClass = STATUS_COLORS[job.status] || 'bg-gray-100 text-gray-700';

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Browse Jobs
            </button>

            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-2xl font-bold text-gray-900 leading-tight">
                            {job.title}
                        </CardTitle>
                        <div className="flex flex-col gap-2 items-end flex-shrink-0">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${urgencyClass}`}>
                                {job.urgency}
                            </span>
                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusClass}`}>
                                {job.status}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="font-medium text-gray-900">
                                ${job.budgetMin} – ${job.budgetMax}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span>{job.location}</span>
                        </div>
                        {job.category && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Tag className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                <span>{job.category}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span>{job.postedAt ? formatRelativeTime(job.postedAt) : 'Recently posted'}</span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                            {job.description}
                        </p>
                    </div>

                    {/* Photos */}
                    {job.photoUrls?.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Photos</h3>
                            <div className="flex gap-3 flex-wrap">
                                {job.photoUrls.map((url, i) => (
                                    <img
                                        key={i}
                                        src={url}
                                        alt={`Job photo ${i + 1}`}
                                        className="w-28 h-28 object-cover rounded-lg border border-gray-200"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Customer Info */}
                    {job.customer && (
                        <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{job.customer.name}</p>
                                <p className="text-xs text-gray-500">{job.customer.location}</p>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-xs text-gray-500">Applications</p>
                                <p className="text-lg font-bold text-gray-900">{job.applicationCount ?? 0}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
