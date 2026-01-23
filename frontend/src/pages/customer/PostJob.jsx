import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, Loader2, Upload, X, CheckCircle2 } from 'lucide-react';
import { jobsAPI, categoriesAPI } from '../../lib/api';
import { ROUTES, VALIDATION } from '../../lib/constants';
import { validators } from '../../lib/utils';
import ScrollReveal from '../../components/ui/ScrollReveal';

/**
 * Location options for Lebanon governorates
 * Values match backend enum exactly
 */
const LOCATIONS = [
    { value: 'BEIRUT', label: 'Beirut' },
    { value: 'MOUNT_LEBANON', label: 'Mount Lebanon' },
    { value: 'NORTH_LEBANON', label: 'North Lebanon' },
    { value: 'SOUTH_LEBANON', label: 'South Lebanon' },
    { value: 'BEKAA', label: 'Bekaa' },
    { value: 'NABATIEH', label: 'Nabatieh' }
];

/**
 * Urgency levels with associated styling
 */
const URGENCY_OPTIONS = [
    { value: 'LOW', label: 'Low', className: 'bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200' },
    { value: 'MEDIUM', label: 'Medium', className: 'bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200' },
    { value: 'HIGH', label: 'High', className: 'bg-rose-100 text-rose-700 border-rose-300 hover:bg-rose-200' }
];

/**
 * Minimum budget allowed
 */
const MIN_BUDGET = 10;

export const PostJob = () => {
    const navigate = useNavigate();
    
    // Form state - matches backend expected fields
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categoryId: '',
        location: 'BEIRUT',
        budgetMin: '',
        budgetMax: '',
        urgency: 'MEDIUM'
    });
    
    // Photos state - stores File objects and preview URLs
    const [photos, setPhotos] = useState([]);
    
    // UI state
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    // Categories loaded from API
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    /**
     * Load categories on component mount
     */
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                const response = await categoriesAPI.getAll();
                setCategories(response.data || response || []);
            } catch (error) {
                console.error('Failed to load categories:', error);
                // Fallback categories if API fails
                setCategories([
                    { id: 1, name: 'Plumbing' },
                    { id: 2, name: 'Electrical' },
                    { id: 3, name: 'Cleaning' },
                    { id: 4, name: 'Carpentry' },
                    { id: 5, name: 'Painting' },
                    { id: 6, name: 'HVAC' },
                    { id: 7, name: 'Landscaping' },
                    { id: 8, name: 'General Repair' }
                ]);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

    /**
     * Cleanup blob URLs when component unmounts
     */
    useEffect(() => {
        return () => {
            photos.forEach(photo => URL.revokeObjectURL(photo.preview));
        };
    }, [photos]);

    /**
     * Handle text/number input changes
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    /**
     * Handle category dropdown change
     */
    const handleCategoryChange = (value) => {
        setFormData(prev => ({ ...prev, categoryId: value }));
        if (errors.categoryId) {
            setErrors(prev => ({ ...prev, categoryId: '' }));
        }
    };

    /**
     * Handle location dropdown change
     */
    const handleLocationChange = (value) => {
        setFormData(prev => ({ ...prev, location: value }));
        if (errors.location) {
            setErrors(prev => ({ ...prev, location: '' }));
        }
    };

    /**
     * Handle urgency selection
     */
    const handleUrgencyChange = (value) => {
        setFormData(prev => ({ ...prev, urgency: value }));
    };

    /**
     * Handle photo file selection
     */
    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        setApiError('');

        // Validate total count
        if (photos.length + files.length > VALIDATION.MAX_JOB_PHOTOS) {
            setApiError(`Maximum ${VALIDATION.MAX_JOB_PHOTOS} photos allowed. You can add ${VALIDATION.MAX_JOB_PHOTOS - photos.length} more.`);
            e.target.value = '';
            return;
        }

        // Validate each file
        const validFiles = [];
        for (const file of files) {
            if (!validators.fileType(file)) {
                setApiError('Only JPEG, PNG, and WebP images are allowed');
                e.target.value = '';
                return;
            }
            if (!validators.fileSize(file)) {
                setApiError(`File "${file.name}" exceeds ${VALIDATION.MAX_FILE_SIZE_MB}MB limit`);
                e.target.value = '';
                return;
            }
            validFiles.push(file);
        }

        // Create preview URLs and add to state
        const newPhotos = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setPhotos(prev => [...prev, ...newPhotos]);
        
        // Reset file input to allow selecting same files again
        e.target.value = '';
    };

    /**
     * Remove a photo at the specified index
     */
    const removePhoto = (index) => {
        setPhotos(prev => {
            // Revoke URL to free memory
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    /**
     * Validate form fields
     */
    const validate = () => {
        const newErrors = {};

        // Title validation
        if (!formData.title.trim()) {
            newErrors.title = 'Job title is required';
        } else if (formData.title.length > VALIDATION.JOB_TITLE_MAX_LENGTH) {
            newErrors.title = `Title must be less than ${VALIDATION.JOB_TITLE_MAX_LENGTH} characters`;
        }

        // Description validation
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length > VALIDATION.JOB_DESCRIPTION_MAX_LENGTH) {
            newErrors.description = `Description must be less than ${VALIDATION.JOB_DESCRIPTION_MAX_LENGTH} characters`;
        }

        // Category validation
        if (!formData.categoryId) {
            newErrors.categoryId = 'Please select a category';
        }

        // Location validation
        if (!formData.location) {
            newErrors.location = 'Please select a location';
        }

        // Budget validation
        const budgetMin = parseFloat(formData.budgetMin);
        const budgetMax = parseFloat(formData.budgetMax);

        if (!formData.budgetMin || isNaN(budgetMin)) {
            newErrors.budgetMin = 'Minimum budget is required';
        } else if (budgetMin < MIN_BUDGET) {
            newErrors.budgetMin = `Minimum budget must be at least $${MIN_BUDGET}`;
        }

        if (!formData.budgetMax || isNaN(budgetMax)) {
            newErrors.budgetMax = 'Maximum budget is required';
        } else if (budgetMin && budgetMax <= budgetMin) {
            newErrors.budgetMax = 'Maximum must be greater than minimum budget';
        }

        // Urgency validation
        if (!formData.urgency) {
            newErrors.urgency = 'Please select urgency level';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Handle form submission
     * Creates FormData with JSON job data and photo files
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        setSuccessMessage('');

        if (!validate()) {
            // Scroll to first error
            const firstError = document.querySelector('.text-red-600');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setLoading(true);

        try {
            // Create FormData for multipart/form-data submission
            const submitFormData = new FormData();

            // Prepare job data object with proper types
            const jobData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                categoryId: parseInt(formData.categoryId, 10),
                budgetMin: parseFloat(formData.budgetMin),
                budgetMax: parseFloat(formData.budgetMax),
                location: formData.location,
                urgency: formData.urgency
            };

            // Append job data as JSON string under 'data' key
            submitFormData.append('data', JSON.stringify(jobData));

            // Append each photo file under 'photos' key
            photos.forEach(photo => {
                submitFormData.append('photos', photo.file);
            });

            // Call API - DO NOT manually set Content-Type header
            // Let browser set it with proper boundary for multipart/form-data
            const response = await jobsAPI.create(submitFormData);

            // Show success message
            setSuccessMessage('Job posted successfully! Providers can now apply.');

            // Redirect after brief delay
            setTimeout(() => {
                const jobId = response.data?.jobId || response.jobId;
                if (jobId) {
                    navigate(`/customer/jobs/${jobId}`);
                } else {
                    navigate(ROUTES.CUSTOMER_DASHBOARD);
                }
            }, 1500);

        } catch (error) {
            console.error('Failed to create job:', error);

            if (error.response?.status === 401) {
                // Unauthorized - redirect to login
                navigate(ROUTES.LOGIN, { state: { from: '/customer/post-job' } });
            } else if (error.response?.status === 400) {
                // Validation errors from backend
                const backendErrors = error.response.data?.errors;
                if (backendErrors && typeof backendErrors === 'object') {
                    setErrors(backendErrors);
                } else {
                    setApiError(error.response.data?.message || 'Please check your input and try again.');
                }
            } else if (error.response?.status === 403) {
                setApiError('You do not have permission to post jobs. Please ensure you are logged in as a customer.');
            } else {
                setApiError(error.message || 'Failed to post job. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <ScrollReveal>
                <div className="flex flex-col items-center justify-center gap-2 text-center py-8">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">Post a New Job</h1>
                    <p className="text-lg text-gray-600 max-w-2xl">Fill in the details to find the right service provider</p>
                </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center border-b border-gray-200 border-b-2 pb-2">Job Details</CardTitle>
                        <CardDescription className="text-center pt-2">
                            Provide clear information to attract qualified providers
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Success Message */}
                            {successMessage && (
                                <Alert className="bg-emerald-50 border-emerald-200">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    <AlertDescription className="text-emerald-700">{successMessage}</AlertDescription>
                                </Alert>
                            )}

                            {/* API Error */}
                            {apiError && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{apiError}</AlertDescription>
                                </Alert>
                            )}

                            {/* ==================== TITLE ==================== */}
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
                                    className={errors.title ? 'border-red-500' : ''}
                                />
                                <div className="flex justify-between">
                                    {errors.title ? (
                                        <p className="text-sm text-red-600">{errors.title}</p>
                                    ) : (
                                        <p className="text-sm text-gray-500">Give your job a clear, descriptive title</p>
                                    )}
                                    <p className="text-sm text-gray-400">
                                        {formData.title.length}/{VALIDATION.JOB_TITLE_MAX_LENGTH}
                                    </p>
                                </div>
                            </div>

                            {/* ==================== DESCRIPTION ==================== */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the work needed in detail..."
                                    disabled={loading}
                                    rows={5}
                                    maxLength={VALIDATION.JOB_DESCRIPTION_MAX_LENGTH}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                <div className="flex justify-between">
                                    {errors.description ? (
                                        <p className="text-sm text-red-600">{errors.description}</p>
                                    ) : (
                                        <p className="text-sm text-gray-500">Be specific to attract qualified providers</p>
                                    )}
                                    <p className="text-sm text-gray-400">
                                        {formData.description.length}/{VALIDATION.JOB_DESCRIPTION_MAX_LENGTH}
                                    </p>
                                </div>
                            </div>

                            {/* ==================== CATEGORY & LOCATION ==================== */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Category - Loaded from API */}
                                <div className="space-y-2">
                                    <Label htmlFor="categoryId">Category *</Label>
                                    <Select 
                                        value={formData.categoryId} 
                                        onValueChange={handleCategoryChange} 
                                        disabled={loading || categoriesLoading}
                                    >
                                        <SelectTrigger className={errors.categoryId ? 'border-red-500' : ''}>
                                            <SelectValue placeholder={categoriesLoading ? "Loading..." : "Select a category"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(category => (
                                                <SelectItem key={category.id} value={String(category.id)}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.categoryId && (
                                        <p className="text-sm text-red-600">{errors.categoryId}</p>
                                    )}
                                </div>

                                {/* Location - Dropdown with Lebanon governorates */}
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location *</Label>
                                    <Select 
                                        value={formData.location} 
                                        onValueChange={handleLocationChange} 
                                        disabled={loading}
                                    >
                                        <SelectTrigger className={errors.location ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select a location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {LOCATIONS.map(loc => (
                                                <SelectItem key={loc.value} value={loc.value}>
                                                    {loc.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.location && (
                                        <p className="text-sm text-red-600">{errors.location}</p>
                                    )}
                                </div>
                            </div>

                            {/* ==================== BUDGET ==================== */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="budgetMin">Minimum Budget ($) *</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                        <Input
                                            id="budgetMin"
                                            name="budgetMin"
                                            type="number"
                                            min={MIN_BUDGET}
                                            step="0.01"
                                            value={formData.budgetMin}
                                            onChange={handleChange}
                                            placeholder="50"
                                            disabled={loading}
                                            className={`pl-7 ${errors.budgetMin ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.budgetMin ? (
                                        <p className="text-sm text-red-600">{errors.budgetMin}</p>
                                    ) : (
                                        <p className="text-sm text-gray-500">Minimum ${MIN_BUDGET}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="budgetMax">Maximum Budget ($) *</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                        <Input
                                            id="budgetMax"
                                            name="budgetMax"
                                            type="number"
                                            min={formData.budgetMin || MIN_BUDGET}
                                            step="0.01"
                                            value={formData.budgetMax}
                                            onChange={handleChange}
                                            placeholder="150"
                                            disabled={loading}
                                            className={`pl-7 ${errors.budgetMax ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.budgetMax ? (
                                        <p className="text-sm text-red-600">{errors.budgetMax}</p>
                                    ) : (
                                        <p className="text-sm text-gray-500">Must be greater than minimum</p>
                                    )}
                                </div>
                            </div>

                            {/* ==================== URGENCY ==================== */}
                            <div className="space-y-2">
                                <Label>Urgency Level *</Label>
                                <div className="flex flex-wrap gap-3">
                                    {URGENCY_OPTIONS.map(option => (
                                        <label
                                            key={option.value}
                                            className="flex-1 min-w-[100px] cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="urgency"
                                                value={option.value}
                                                checked={formData.urgency === option.value}
                                                onChange={() => handleUrgencyChange(option.value)}
                                                disabled={loading}
                                                className="sr-only peer"
                                            />
                                            <div className={`
                                                px-4 py-3 rounded-lg border-2 text-center font-medium transition-all
                                                ${formData.urgency === option.value
                                                    ? option.className + ' border-current ring-2 ring-offset-1'
                                                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                }
                                                peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2
                                                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                                            `}>
                                                {option.label}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.urgency && (
                                    <p className="text-sm text-red-600">{errors.urgency}</p>
                                )}
                            </div>

                            {/* ==================== PHOTOS ==================== */}
                            <div className="space-y-2">
                                <Label>Photos (Optional)</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-sm text-gray-600 mb-1">
                                        Upload up to {VALIDATION.MAX_JOB_PHOTOS} photos
                                    </p>
                                    <p className="text-xs text-gray-500 mb-4">
                                        JPG, PNG, WebP • Max {VALIDATION.MAX_FILE_SIZE_MB}MB each
                                    </p>
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp"
                                        multiple
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                        id="photo-upload"
                                        disabled={loading || photos.length >= VALIDATION.MAX_JOB_PHOTOS}
                                    />
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        disabled={loading || photos.length >= VALIDATION.MAX_JOB_PHOTOS}
                                        onClick={() => document.getElementById('photo-upload').click()}
                                    >
                                        Choose Files
                                    </Button>
                                </div>

                                {/* Photo Previews */}
                                {photos.length > 0 && (
                                    <div className="space-y-2 mt-4">
                                        <p className="text-sm text-gray-600">
                                            {photos.length} of {VALIDATION.MAX_JOB_PHOTOS} photos selected
                                        </p>
                                        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                                            {photos.map((photo, index) => (
                                                <div key={index} className="relative group aspect-square">
                                                    <img
                                                        src={photo.preview}
                                                        alt={`Upload ${index + 1}`}
                                                        className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removePhoto(index)}
                                                        disabled={loading}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 disabled:opacity-50"
                                                        aria-label={`Remove photo ${index + 1}`}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    {/* Photo number badge */}
                                                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ==================== SUBMIT BUTTONS ==================== */}
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

                            <p className="text-center text-sm text-gray-500">
                                Your job will be visible to providers immediately after posting
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </ScrollReveal>
        </div>
    );
};