import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { MapPin, DollarSign, Calendar, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { jobsAPI, applicationsAPI } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import { ROUTES } from '../../lib/constants';

export const ApplyToJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState('');
    const [formData, setFormData] = useState({
        quote: '',
        availability: '',
        message: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const data = await jobsAPI.getById(id);
            setJob(data.job);
        } catch (error) {
            console.error('Error fetching job:', error);
            setApiError('Failed to load job details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.quote || parseFloat(formData.quote) <= 0) {
            newErrors.quote = 'Please enter a valid quote amount';
        }

        if (job && parseFloat(formData.quote) > job.budgetMax) {
            newErrors.quote = `Quote exceeds maximum budget of ${formatCurrency(job.budgetMax)}`;
        }

        if (!formData.availability.trim()) {
            newErrors.availability = 'Please specify your availability';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Please provide a message';
        } else if (formData.message.length < 20) {
            newErrors.message = 'Message should be at least 20 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (!validate()) {
            return;
        }

        setSubmitting(true);

        try {
            await applicationsAPI.apply(id, {
                quote: parseFloat(formData.quote),
                availability: formData.availability,
                message: formData.message,
            });

            navigate(ROUTES.MY_APPLICATIONS);
        } catch (error) {
            setApiError(error.message || 'Failed to submit application. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!job) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
                <Button onClick={() => navigate(ROUTES.BROWSE_JOBS)} className="mt-4">
                    Back to Browse Jobs
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Button */}
            <Button variant="ghost" onClick={() => navigate(ROUTES.BROWSE_JOBS)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
            </Button>

            {/* Job Information */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">{job.title}</CardTitle>
                            <p className="text-gray-600 mt-1">Posted {formatDate(job.createdAt)}</p>
                        </div>
                        <Badge>{job.category}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-700">{job.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-gray-700">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold">
                                {formatCurrency(job.budgetMin)} - {formatCurrency(job.budgetMax)}
                            </span>
                        </div>
                    </div>

                    {job.photos && job.photos.length > 0 && (
                        <div className="pt-4 border-t">
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

            {/* Application Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Submit Your Application</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {apiError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{apiError}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="quote">Your Quote ($) *</Label>
                            <Input
                                id="quote"
                                name="quote"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.quote}
                                onChange={handleChange}
                                placeholder="Enter your price"
                                disabled={submitting}
                            />
                            {errors.quote && (
                                <p className="text-sm text-red-600">{errors.quote}</p>
                            )}
                            <p className="text-sm text-gray-500">
                                Budget range: {formatCurrency(job.budgetMin)} - {formatCurrency(job.budgetMax)}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="availability">Availability *</Label>
                            <Input
                                id="availability"
                                name="availability"
                                value={formData.availability}
                                onChange={handleChange}
                                placeholder="e.g., Available this weekend, Can start tomorrow"
                                disabled={submitting}
                            />
                            {errors.availability && (
                                <p className="text-sm text-red-600">{errors.availability}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Cover Message *</Label>
                            <Textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Explain why you're the best fit for this job, your experience, and approach..."
                                rows={6}
                                disabled={submitting}
                            />
                            <p className="text-sm text-gray-500">
                                {formData.message.length} characters (minimum 20)
                            </p>
                            {errors.message && (
                                <p className="text-sm text-red-600">{errors.message}</p>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(ROUTES.BROWSE_JOBS)}
                                disabled={submitting}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting} className="flex-1">
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Application'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
