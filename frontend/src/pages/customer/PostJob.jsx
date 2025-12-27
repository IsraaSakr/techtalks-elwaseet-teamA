import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, Loader2, Upload, X } from 'lucide-react';
import { jobsAPI } from '../../lib/api';
import { SERVICE_CATEGORIES, ROUTES, VALIDATION } from '../../lib/constants';
import { validators } from '../../lib/utils';

export const PostJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        budgetMin: '',
        budgetMax: '',
    });
    const [photos, setPhotos] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCategoryChange = (value) => {
        setFormData(prev => ({ ...prev, category: value }));
        if (errors.category) {
            setErrors(prev => ({ ...prev, category: '' }));
        }
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);

        // Validate files
        const validFiles = files.filter(file => {
            if (!validators.fileType(file)) {
                setApiError('Only JPEG, PNG, and WebP images are allowed');
                return false;
            }
            if (!validators.fileSize(file)) {
                setApiError(`File ${file.name} exceeds ${VALIDATION.MAX_FILE_SIZE_MB}MB limit`);
                return false;
            }
            return true;
        });

        if (photos.length + validFiles.length > VALIDATION.MAX_JOB_PHOTOS) {
            setApiError(`Maximum ${VALIDATION.MAX_JOB_PHOTOS} photos allowed`);
            return;
        }

        // Create preview URLs
        const newPhotos = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setPhotos(prev => [...prev, ...newPhotos]);
    };

    const removePhoto = (index) => {
        setPhotos(prev => {
            const newPhotos = [...prev];
            URL.revokeObjectURL(newPhotos[index].preview);
            newPhotos.splice(index, 1);
            return newPhotos;
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Job title is required';
        } else if (formData.title.length > VALIDATION.JOB_TITLE_MAX_LENGTH) {
            newErrors.title = `Title must be less than ${VALIDATION.JOB_TITLE_MAX_LENGTH} characters`;
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length > VALIDATION.JOB_DESCRIPTION_MAX_LENGTH) {
            newErrors.description = `Description must be less than ${VALIDATION.JOB_DESCRIPTION_MAX_LENGTH} characters`;
        }

        if (!formData.category) {
            newErrors.category = 'Please select a category';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        const budgetMin = parseFloat(formData.budgetMin);
        const budgetMax = parseFloat(formData.budgetMax);

        if (!formData.budgetMin || isNaN(budgetMin) || budgetMin <= 0) {
            newErrors.budgetMin = 'Please enter a valid minimum budget';
        }

        if (!formData.budgetMax || isNaN(budgetMax) || budgetMax <= 0) {
            newErrors.budgetMax = 'Please enter a valid maximum budget';
        }

        if (budgetMin && budgetMax && budgetMin > budgetMax) {
            newErrors.budgetMax = 'Maximum budget must be greater than minimum';
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

        setLoading(true);

        try {
            // In a real app, you'd upload photos first and get URLs
            const photoUrls = photos.map(p => p.preview); // Mock URLs

            const jobData = {
                ...formData,
                budgetMin: parseFloat(formData.budgetMin),
                budgetMax: parseFloat(formData.budgetMax),
                photos: photoUrls,
            };

            await jobsAPI.create(jobData);
            navigate(ROUTES.CUSTOMER_DASHBOARD);
        } catch (error) {
            setApiError(error.message || 'Failed to post job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
                <p className="text-gray-600 mt-1">Fill in the details to find the right service provider</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                    <CardDescription>
                        Provide clear information to attract qualified providers
                    </CardDescription>
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
                            <Label htmlFor="title">Job Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Fix leaking kitchen sink"
                                disabled={loading}
                                maxLength={VALIDATION.JOB_TITLE_MAX_LENGTH}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-600">{errors.title}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe what needs to be done in detail..."
                                disabled={loading}
                                rows={5}
                                maxLength={VALIDATION.JOB_DESCRIPTION_MAX_LENGTH}
                            />
                            <p className="text-sm text-gray-500">
                                {formData.description.length}/{VALIDATION.JOB_DESCRIPTION_MAX_LENGTH}
                            </p>
                            {errors.description && (
                                <p className="text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select value={formData.category} onValueChange={handleCategoryChange} disabled={loading}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SERVICE_CATEGORIES.map(category => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-sm text-red-600">{errors.category}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location *</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g., Beirut"
                                    disabled={loading}
                                />
                                {errors.location && (
                                    <p className="text-sm text-red-600">{errors.location}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="budgetMin">Minimum Budget ($) *</Label>
                                <Input
                                    id="budgetMin"
                                    name="budgetMin"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.budgetMin}
                                    onChange={handleChange}
                                    placeholder="50"
                                    disabled={loading}
                                />
                                {errors.budgetMin && (
                                    <p className="text-sm text-red-600">{errors.budgetMin}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="budgetMax">Maximum Budget ($) *</Label>
                                <Input
                                    id="budgetMax"
                                    name="budgetMax"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.budgetMax}
                                    onChange={handleChange}
                                    placeholder="150"
                                    disabled={loading}
                                />
                                {errors.budgetMax && (
                                    <p className="text-sm text-red-600">{errors.budgetMax}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Photos (Optional)</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-sm text-gray-600 mb-2">
                                    Upload up to {VALIDATION.MAX_JOB_PHOTOS} photos
                                </p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                    id="photo-upload"
                                    disabled={loading || photos.length >= VALIDATION.MAX_JOB_PHOTOS}
                                />
                                <Label htmlFor="photo-upload" className="cursor-pointer">
                                    <Button type="button" variant="outline" disabled={loading || photos.length >= VALIDATION.MAX_JOB_PHOTOS}>
                                        Choose Files
                                    </Button>
                                </Label>
                            </div>

                            {photos.length > 0 && (
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                                    {photos.map((photo, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={photo.preview}
                                                alt={`Upload ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(ROUTES.CUSTOMER_DASHBOARD)}
                                disabled={loading}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="flex-1">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Posting...
                                    </>
                                ) : (
                                    'Post Job'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
