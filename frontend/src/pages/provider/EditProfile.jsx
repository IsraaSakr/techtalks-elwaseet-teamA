import { useState, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { User, Save, X, AlertCircle, Plus, Trash2, MapPin, Mail, Phone, Upload } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { SERVICE_CATEGORIES } from '../../lib/constants';
import ScrollReveal from '../../components/ui/ScrollReveal';

export const EditProfile = () => {
    const { user } = useAuth();
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        location: user?.location || '',
        bio: user?.bio || '',
        hourlyRate: user?.hourlyRate || '',
        services: user?.services || [],
    });
    const [newService, setNewService] = useState('');
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [imagePreview, setImagePreview] = useState(user?.profilePicture || null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
            // TODO: Implement actual file upload to server
            console.log('File selected:', file);
        }
    };

    const handleAddService = () => {
        if (newService && !formData.services.includes(newService)) {
            setFormData(prev => ({
                ...prev,
                services: [...prev.services, newService]
            }));
            setNewService('');
        }
    };

    const handleRemoveService = (service) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.filter(s => s !== service)
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        if (formData.hourlyRate && (isNaN(formData.hourlyRate) || parseFloat(formData.hourlyRate) <= 0)) {
            newErrors.hourlyRate = 'Please enter a valid hourly rate';
        }

        if (formData.services.length === 0) {
            newErrors.services = 'Please add at least one service';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        setSuccessMessage('');

        if (!validate()) {
            return;
        }

        setSaving(true);

        try {
            // TODO: Implement actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccessMessage('Profile updated successfully!');

            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            setErrors({ api: 'Failed to update profile. Please try again.' });
            console.log(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <ScrollReveal>
                <div className="flex flex-col items-center justify-center gap-2 text-center py-6">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Profile</h1>
                    <p className="text-gray-600">Update your provider information and services</p>
                </div>
            </ScrollReveal>

            {successMessage && (
                <ScrollReveal>
                    <Alert className="bg-green-50 border-green-200 shadow-sm mb-6">
                        <AlertDescription className="text-green-800 font-medium text-center">{successMessage}</AlertDescription>
                    </Alert>
                </ScrollReveal>
            )}

            {errors.api && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.api}</AlertDescription>
                </Alert>
            )}

            {/* Profile Picture */}
            <ScrollReveal delay={0.1}>
            <Card className="border-2 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <User className="w-5 h-5" /> Profile Picture
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        <div className="relative">
                            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                                <AvatarImage src={imagePreview} className="object-cover" />
                                <AvatarFallback className="text-4xl bg-blue-100 text-blue-600 font-bold">
                                    {user?.fullName?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <button 
                                type="button"
                                onClick={handleFileClick}
                                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors"
                            >
                                <Upload className="w-4 h-4" />
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/png, image/jpeg, image/webp"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="text-center sm:text-left space-y-2">
                            <h3 className="font-medium text-gray-900">Profile Photo</h3>
                            <p className="text-sm text-gray-500 max-w-xs">
                                Upload a clear photo to help customers recognize you. JPG, PNG or WebP. Max 5MB.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            </ScrollReveal>

            {/* Basic Information */}
            <ScrollReveal delay={0.2}>
            <Card className="border-2 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    disabled={saving}
                                    className="pl-10"
                                />
                            </div>
                            {errors.fullName && (
                                <p className="text-sm text-red-600">{errors.fullName}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={saving}
                                    className="pl-10"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone *</Label>
                             <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={saving}
                                    className="pl-10"
                                />
                            </div>
                            {errors.phone && (
                                <p className="text-sm text-red-600">{errors.phone}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location *</Label>
                             <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    disabled={saving}
                                    className="pl-10"
                                />
                            </div>
                            {errors.location && (
                                <p className="text-sm text-red-600">{errors.location}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell customers about your experience and expertise..."
                            rows={4}
                            disabled={saving}
                        />
                        <p className="text-sm text-gray-500 text-right">{formData.bio.length}/500 characters</p>
                    </div>
                </CardContent>
            </Card>
            </ScrollReveal>

            {/* Services & Pricing */}
            <ScrollReveal delay={0.3}>
            <Card className="border-2 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Services & Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                        <Input
                            id="hourlyRate"
                            name="hourlyRate"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.hourlyRate}
                            onChange={handleChange}
                            placeholder="50"
                            disabled={saving}
                            className="max-w-xs"
                        />
                        {errors.hourlyRate && (
                            <p className="text-sm text-red-600">{errors.hourlyRate}</p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Label>Services Offered *</Label>
                        <div className="flex gap-2">
                            <Select value={newService} onValueChange={setNewService} disabled={saving}>
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SERVICE_CATEGORIES.filter(cat => !formData.services.includes(cat)).map(category => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button type="button" onClick={handleAddService} disabled={!newService || saving}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add
                            </Button>
                        </div>
                        {errors.services && (
                            <p className="text-sm text-red-600">{errors.services}</p>
                        )}
                    </div>

                    {formData.services.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-dashed">
                            {formData.services.map((service, index) => (
                                <Badge key={index} variant="secondary" className="text-sm py-1.5 px-3 bg-white border shadow-sm">
                                    {service}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveService(service)}
                                        className="ml-2 hover:text-red-600 text-gray-400 transition-colors"
                                        disabled={saving}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
            </ScrollReveal>

            {/* Action Buttons */}
            <ScrollReveal delay={0.4}>
                <div className="flex gap-4 sticky bottom-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl border-t border shadow-lg z-10">
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                        disabled={saving}
                        className="flex-1 h-12 text-base"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving} className="flex-1 h-12 text-base bg-blue-600 hover:bg-blue-700">
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Saving Changes...' : 'Save Changes'}
                    </Button>
                </div>
            </ScrollReveal>
        </div>
    );
};
