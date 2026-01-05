import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { 
    AlertCircle, 
    Loader2, 
    Check, 
    MapPin, 
    Eye, 
    EyeOff, 
    Shield,
    UserPlus,
    Mail,
    Phone,
    Lock,
    MapPinned,
    Briefcase,
    ArrowRight,
    CheckCircle,
} from 'lucide-react';
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

    // Password strength indicator
    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return null;
        
        const validation = validators.password(password);
        if (validation.valid) return { strength: 'Strong', color: 'text-green-600', bg: 'bg-green-500' };
        if (password.length >= 6) return { strength: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-500' };
        return { strength: 'Weak', color: 'text-red-600', bg: 'bg-red-500' };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-[#163248] via-blue-900 to-blue-800">
            {/* Animated Background */}
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

            {/* Decorative blobs */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="w-full max-w-7xl flex items-start justify-center gap-12 relative z-10">
                {/* Left side - Branding/Benefits */}
                <div className="hidden lg:flex flex-1 flex-col text-white space-y-8 pt-12">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold leading-tight">
                            Join ElWaseet
                            <span className="block text-[#bf9a47] mt-2">Start Your Journey</span>
                        </h1>
                        <p className="text-xl text-blue-100 leading-relaxed">
                            Whether you're looking to hire or offer services, we've got you covered
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20 hover:bg-white/15 transition-colors">
                            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Quick & Easy Setup</h3>
                                <p className="text-sm text-blue-100">Create your account in less than 2 minutes and start connecting</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20 hover:bg-white/15 transition-colors">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Safe & Secure</h3>
                                <p className="text-sm text-blue-100">Your data is encrypted and protected with industry-standard security</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20 hover:bg-white/15 transition-colors">
                            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Flexible Options</h3>
                                <p className="text-sm text-blue-100">Choose to be a customer, provider, or both - it's up to you</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/20">
                        <p className="text-sm text-blue-200 flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-400" />
                            Join 12,000+ users already on the platform
                        </p>
                    </div>
                </div>

                {/* Right side - Registration Form */}
                <div className="w-full lg:w-auto lg:min-w-[560px]">
                    <Card className="shadow-2xl border-0">
                        <CardHeader className="space-y-1 pb-6">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#bf9a47] to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <UserPlus className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-bold text-center text-gray-900">
                                Create Your Account
                            </CardTitle>
                            <CardDescription className="text-center text-base text-gray-600">
                                Fill in your details below to get started
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pb-8">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {apiError && (
                                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                                        <AlertCircle className="h-5 w-5" />
                                        <AlertDescription className="text-sm">{apiError}</AlertDescription>
                                    </Alert>
                                )}

                                {/* Full Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <UserPlus className="w-4 h-4 text-gray-500" />
                                        Full Name
                                    </Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        disabled={loading}
                                        className={`h-11 transition-all ${
                                            errors.fullName 
                                                ? 'border-red-500 focus-visible:ring-red-500' 
                                                : 'focus-visible:ring-[#125e3b]'
                                        }`}
                                    />
                                    {errors.fullName && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                                            {errors.fullName}
                                        </p>
                                    )}
                                </div>

                                {/* Email & Phone - Two columns */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-500" />
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            disabled={loading}
                                            className={`h-11 transition-all ${
                                                errors.email 
                                                    ? 'border-red-500 focus-visible:ring-red-500' 
                                                    : 'focus-visible:ring-[#125e3b]'
                                            }`}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-500" />
                                            Phone
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+9611234567"
                                            disabled={loading}
                                            className={`h-11 transition-all ${
                                                errors.phone 
                                                    ? 'border-red-500 focus-visible:ring-red-500' 
                                                    : 'focus-visible:ring-[#125e3b]'
                                            }`}
                                        />
                                        {errors.phone && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Location & Role - Two columns */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <MapPinned className="w-4 h-4 text-gray-500" />
                                            Location
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="location"
                                                name="location"
                                                type="text"
                                                value={formData.location}
                                                onChange={handleChange}
                                                placeholder="Beirut"
                                                disabled={loading || locationLoading}
                                                className={`h-11 pr-11 transition-all ${
                                                    errors.location 
                                                        ? 'border-red-500 focus-visible:ring-red-500' 
                                                        : 'focus-visible:ring-[#125e3b]'
                                                }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={detectLocation}
                                                disabled={loading || locationLoading}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#125e3b] disabled:opacity-50 transition-colors"
                                                title="Detect current location"
                                            >
                                                {locationLoading ? (
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                ) : (
                                                    <MapPin className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.location && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                                                {errors.location}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Briefcase className="w-4 h-4 text-gray-500" />
                                            I want to
                                        </Label>
                                        <Select value={formData.role} onValueChange={handleRoleChange} disabled={loading}>
                                            <SelectTrigger className="h-11 focus:ring-[#125e3b]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={USER_ROLES.PROVIDER}>Offer my services</SelectItem>
                                                <SelectItem value={USER_ROLES.HYBRID}>Hire & offer services (Both)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-gray-500" />
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            disabled={loading}
                                            className={`h-11 pr-11 transition-all ${
                                                errors.password 
                                                    ? 'border-red-500 focus-visible:ring-red-500' 
                                                    : 'focus-visible:ring-[#125e3b]'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#125e3b] focus:outline-none transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    
                                    {/* Password strength indicator */}
                                    {passwordStrength && (
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${passwordStrength.bg} transition-all duration-300`}
                                                        style={{ 
                                                            width: passwordStrength.strength === 'Weak' ? '33%' : 
                                                                   passwordStrength.strength === 'Medium' ? '66%' : '100%' 
                                                        }}
                                                    />
                                                </div>
                                                <span className={`text-xs font-medium ${passwordStrength.color}`}>
                                                    {passwordStrength.strength}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {errors.password && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password - Only show when password is valid */}
                                {validators.password(formData.password).valid && (
                                    <div className="space-y-2 animate-in slide-in-from-top-4 fade-in duration-500 ease-out">
                                        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Lock className="w-4 h-4 text-gray-500" />
                                            Confirm Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                disabled={loading}
                                                className={`h-11 pr-11 transition-all ${
                                                    errors.confirmPassword 
                                                        ? 'border-red-500 focus-visible:ring-red-500' 
                                                        : 'focus-visible:ring-[#125e3b]'
                                                }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#125e3b] focus:outline-none transition-colors"
                                                tabIndex={-1}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                            <p className="text-sm text-green-600 flex items-center gap-1">
                                                <Check className="w-4 h-4" />
                                                Passwords match
                                            </p>
                                        )}
                                        {errors.confirmPassword && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                                                {errors.confirmPassword}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <Button 
                                    type="submit" 
                                    className="w-full h-12 bg-[#125e3b] hover:bg-[#0f4d30] text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mt-6" 
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Creating your account...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </>
                                    )}
                                </Button>

                                {/* Terms notice */}
                                <p className="text-xs text-center text-gray-500 pt-2">
                                    By creating an account, you agree to our{' '}
                                    <Link to="#" className="text-[#125e3b] hover:underline">Terms of Service</Link>
                                    {' '}and{' '}
                                    <Link to="#" className="text-[#125e3b] hover:underline">Privacy Policy</Link>
                                </p>

                                {/* Divider */}
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-gray-500 font-medium">
                                            Already have an account?
                                        </span>
                                    </div>
                                </div>

                                {/* Sign In Link */}
                                <div className="text-center">
                                    <Link 
                                        to={ROUTES.LOGIN} 
                                        className="text-[#125e3b] hover:text-[#0f4d30] font-semibold hover:underline transition-colors text-base"
                                    >
                                        Sign in instead
                                    </Link>
                                </div>
                            </form>

                            {/* Trust Indicators */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Shield className="w-3 h-3" />
                                        <span>256-bit SSL</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        <span>Verified Platform</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Lock className="w-3 h-3" />
                                        <span>Secure Data</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};