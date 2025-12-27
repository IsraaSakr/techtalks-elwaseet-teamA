import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { User, Save, X, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { SERVICE_CATEGORIES } from '../../lib/constants';

export const EditProfile = () => {
    const { user } = useAuth();
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
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
        <div className="max-w-4xl space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
                <p className="text-gray-600 mt-1">Update your provider information and services</p>
            </div>

            {successMessage && (
                <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
                </Alert>
            )}

            {errors.api && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.api}</AlertDescription>
                </Alert>
            )}

            {/* Profile Picture */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-6">
                        <Avatar className="w-24 h-24">
                            <AvatarFallback className="text-3xl">
                                {user?.fullName?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <Button variant="outline" disabled>
                                Upload Photo
                            </Button>
                            <p className="text-sm text-gray-500 mt-2">JPG, PNG or WebP. Max 5MB.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                disabled={saving}
                            />
                            {errors.fullName && (
                                <p className="text-sm text-red-600">{errors.fullName}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={saving}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone *</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={saving}
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-600">{errors.phone}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location *</Label>
                            <Input
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                disabled={saving}
                            />
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
                        <p className="text-sm text-gray-500">{formData.bio.length}/500 characters</p>
                    </div>
                </CardContent>
            </Card>

            {/* Services & Pricing */}
            <Card>
                <CardHeader>
                    <CardTitle>Services & Pricing</CardTitle>
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
                        />
                        {errors.hourlyRate && (
                            <p className="text-sm text-red-600">{errors.hourlyRate}</p>
                        )}
                    </div>

                    <div className="space-y-2">
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
                        <div className="flex flex-wrap gap-2">
                            {formData.services.map((service, index) => (
                                <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                                    {service}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveService(service)}
                                        className="ml-2 hover:text-red-600"
                                        disabled={saving}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button
                    variant="outline"
                    onClick={() => window.history.back()}
                    disabled={saving}
                    className="flex-1"
                >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
};
