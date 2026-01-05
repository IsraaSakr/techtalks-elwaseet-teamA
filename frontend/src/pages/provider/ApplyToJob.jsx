import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { MapPin, DollarSign, Calendar, AlertCircle, Loader2, ArrowLeft, Send } from 'lucide-react';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { jobsAPI, applicationsAPI } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import { ROUTES } from '../../lib/constants';
import ScrollReveal from '../../components/ui/ScrollReveal';

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
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Job not found</h2>
                <p className="text-gray-500 mb-6">The job you are looking for does not exist or has been removed.</p>
                <Button onClick={() => navigate(ROUTES.BROWSE_JOBS)}>
                    Back to Browse Jobs
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Back Button */}
            <ScrollReveal>
                <Button variant="ghost" onClick={() => navigate(ROUTES.BROWSE_JOBS)} className="hover:bg-gray-100">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Jobs
                </Button>
            </ScrollReveal>

            {/* Job Information */}
            <ScrollReveal delay={0.1}>
                <Card className="border-2 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-100">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{job.title}</h1>
                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    Posted {formatDate(job.createdAt)}
                                </div>
                            </div>
                            <Badge className="text-base px-4 py-1.5 bg-white text-blue-700 shadow-sm border-blue-100">
                                {job.category}
                            </Badge>
                        </div>
                    </div>
                    
                    <CardContent className="p-6 space-y-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 text-lg">Description</h3>
                            <p className="text-gray-700 leading-relaxed text-lg">{job.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-t border-b bg-gray-50/50 rounded-xl px-4">
                            <div className="flex items-center gap-3 text-gray-700">
                                <div className="p-2 bg-white rounded-full shadow-sm">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="font-medium">{job.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <div className="p-2 bg-white rounded-full shadow-sm">
                                    <DollarSign className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="font-semibold">
                                    {formatCurrency(job.budgetMin)} - {formatCurrency(job.budgetMax)}
                                </span>
                            </div>
                        </div>

                        {job.photos && job.photos.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4 text-lg">Photos</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {job.photos.map((photo, index) => (
                                        <img
                                            key={index}
                                            src={photo}
                                            alt={`Job photo ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-xl shadow-sm border hover:shadow-md transition-all cursor-pointer"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </ScrollReveal>

            {/* Application Form */}
            <ScrollReveal delay={0.2}>
                <Card className="border-2 shadow-lg border-blue-100">
                    <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                        <CardTitle className="text-xl flex items-center gap-2">
                             <Send className="w-5 h-5" /> Submit Your Proposal
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {apiError && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{apiError}</AlertDescription>
                                </Alert>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="quote" className="text-base font-medium">Your Quote ($) *</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                                            className="pl-10 h-12 text-lg"
                                        />
                                    </div>
                                    {errors.quote && (
                                        <p className="text-sm text-red-600">{errors.quote}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Budget: {formatCurrency(job.budgetMin)} - {formatCurrency(job.budgetMax)}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="availability" className="text-base font-medium">Availability *</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="availability"
                                            name="availability"
                                            value={formData.availability}
                                            onChange={handleChange}
                                            placeholder="e.g., Can start tomorrow"
                                            disabled={submitting}
                                            className="pl-10 h-12 text-lg"
                                        />
                                    </div>
                                    {errors.availability && (
                                        <p className="text-sm text-red-600">{errors.availability}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-base font-medium">Cover Message *</Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Explain why you're the best fit for this job..."
                                    rows={6}
                                    disabled={submitting}
                                    className="text-base resize-none"
                                />
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Minimum 20 characters</span>
                                    <span>{formData.message.length} chars</span>
                                </div>
                                {errors.message && (
                                    <p className="text-sm text-red-600">{errors.message}</p>
                                )}
                            </div>

                            <div className="flex gap-4 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate(ROUTES.BROWSE_JOBS)}
                                    disabled={submitting}
                                    className="flex-1 h-12 text-base"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={submitting} className="flex-1 h-12 text-base bg-blue-600 hover:bg-blue-700">
                                    {submitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Application <Send className="ml-2 w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </ScrollReveal>
        </div>
    );
};
