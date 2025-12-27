import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, Loader2, Check, X, MapPin, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { validators } from '../../lib/utils';
import { ROUTES, USER_ROLES } from '../../lib/constants';
import Antigravity from '../../components/ui/Antigravity';

export const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        location: '',
        role: USER_ROLES.HYBRID,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [apiError, setApiError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleRoleChange = (value) => {
        setFormData(prev => ({ ...prev, role: value }));
    };

    const detectLocation = () => {
        if (!navigator.geolocation) {
            setErrors(prev => ({ ...prev, location: 'Geolocation is not supported by your browser' }));
            return;
        }

        setLocationLoading(true);
        setErrors(prev => ({ ...prev, location: '' }));

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();
                    
                    // Extract city or relevant locality
                    const city = data.address.city || data.address.town || data.address.village || data.address.county || '';
                    
                    if (city) {
                        setFormData(prev => ({ ...prev, location: city }));
                    } else {
                        setErrors(prev => ({ ...prev, location: 'Could not detect city name' }));
                    }
                } catch (error) {
                    console.error("Location fetch error:", error);
                    setErrors(prev => ({ ...prev, location: 'Failed to fetch location data' }));
                } finally {
                    setLocationLoading(false);
                }
            },
            (error) => {
                setLocationLoading(false);
                console.error("Geolocation error:", error);
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        setErrors(prev => ({ ...prev, location: 'Location permission denied. Please allow access.' }));
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setErrors(prev => ({ ...prev, location: 'Location unavailable. Check OS location settings.' }));
                        break;
                    case error.TIMEOUT:
                        setErrors(prev => ({ ...prev, location: 'Location request timed out. Try again.' }));
                        break;
                    default:
                        setErrors(prev => ({ ...prev, location: 'An unknown error occurred' }));
                }
            },
            options
        );
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!validators.email(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!validators.phone(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number (e.g., +9611234567)';
        }

        const passwordValidation = validators.password(formData.password);
        if (!passwordValidation.valid) {
            newErrors.password = passwordValidation.message;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
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
            const registrationData = { ...formData };
            delete registrationData.confirmPassword;
            const result = await register(registrationData);

            if (result.success) {
                // Redirect to email verification
                navigate(ROUTES.VERIFY_EMAIL, {
                    state: { email: formData.email }
                });
            } else {
                setApiError(result.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setApiError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-[#163248] to-blue-800">
            <div className="absolute inset-0 z-0 overflow-hidden">
                 <Antigravity
                    count={300}
                    magnetRadius={6}
                    ringRadius={7}
                    waveSpeed={0.4}
                    waveAmplitude={1}
                    particleSize={1.5}
                    lerpSpeed={0.05}
                    color="white"
                    autoAnimate={true}
                    particleVariance={1}
                 />
            </div>
            <Card className="w-full max-w-md relative z-10">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Create an account
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your information to get started
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {apiError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{apiError}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                disabled={loading}
                            />
                            {errors.fullName && (
                                <p className="text-sm text-red-600">{errors.fullName}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                disabled={loading}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+9611234567"
                                disabled={loading}
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-600">{errors.phone}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <div className="relative">
                                    <Input
                                        id="location"
                                        name="location"
                                        type="text"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Beirut"
                                        disabled={loading || locationLoading}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={detectLocation}
                                        disabled={loading || locationLoading}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 disabled:opacity-50"
                                        title="Detect current location"
                                    >
                                        {locationLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <MapPin className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.location && (
                                    <p className="text-sm text-red-600">{errors.location}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">I want to</Label>
                                <Select value={formData.role} onValueChange={handleRoleChange} disabled={loading}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={USER_ROLES.PROVIDER}>Offer my services</SelectItem>
                                        <SelectItem value={USER_ROLES.HYBRID}>Hire service provider</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    disabled={loading}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {validators.password(formData.password).valid && (
                            <div className="space-y-2 animate-in slide-in-from-top-4 fade-in duration-500 ease-out">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        disabled={loading}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                                )}
                            </div>
                        )}

                        <Button type="submit" className="bg-[#125e3b] hover:bg-[#125e3b]/90 text-white w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </Button>

                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to={ROUTES.LOGIN} className="text-blue-600 hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
