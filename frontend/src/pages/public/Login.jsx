import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Loader2, Eye, EyeOff, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../lib/constants';
import Antigravity from '../../components/ui/Antigravity';
import toast from 'react-hot-toast';

export const Login = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Redirect if already authenticated
    if (isAuthenticated) {
        navigate(ROUTES.CUSTOMER_DASHBOARD);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                toast.success('Welcome back! Redirecting...', {
                    icon: '👋',
                    duration: 2000,
                });
                const user = result.user;
                if (user.accountType === 'ADMIN') {
                    navigate(ROUTES.ADMIN_DASHBOARD);
                } else if (user.accountType === 'HYBRID_PROVIDER') {
                    navigate(ROUTES.PROVIDER_DASHBOARD);
                } else {
                    navigate(ROUTES.CUSTOMER_DASHBOARD);
                }
            } else {
                toast.error(result.error || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.');
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

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

            {/* Additional decorative elements */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="w-full max-w-6xl flex items-center justify-center gap-12 relative z-10">
                {/* Left side - Branding/Info */}
                <div className="hidden lg:flex flex-1 flex-col text-white space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold leading-tight">
                            Welcome Back to
                            <span className="block text-[#bf9a47] mt-2">ElWaseet</span>
                        </h1>
                        <p className="text-xl text-blue-100 leading-relaxed">
                            Your trusted platform for connecting with local service providers
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Secure & Protected</h3>
                                <p className="text-sm text-blue-100">Your data is encrypted and safe with us</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Verified Providers</h3>
                                <p className="text-sm text-blue-100">All service providers are background-checked</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <ArrowRight className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Quick & Easy</h3>
                                <p className="text-sm text-blue-100">Find and hire providers in minutes</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-blue-200">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Trusted by 12,000+ users</span>
                    </div>
                </div>

                {/* Right side - Login Form */}
                <div className="w-full lg:w-auto lg:min-w-[480px]">
                    <Card className="shadow-2xl border-0">
                        <CardHeader className="space-y-1 pb-8">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#bf9a47] to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Shield className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-bold text-center text-gray-900">
                                Welcome Back
                            </CardTitle>
                            <CardDescription className="text-center text-base text-gray-600">
                                Sign in to access your account and continue your journey
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pb-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        disabled={loading}
                                        autoComplete="email"
                                        className={`h-12 text-base transition-all ${
                                            errors.email 
                                                ? 'border-red-500 focus-visible:ring-red-500' 
                                                : 'border-gray-300 focus-visible:ring-[#125e3b]'
                                        }`}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                            Password
                                        </Label>
                                        <Link 
                                            to="#" 
                                            className="text-sm text-[#125e3b] hover:text-[#125e3b]/80 font-medium transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            disabled={loading}
                                            autoComplete="current-password"
                                            className={`h-12 text-base pr-12 transition-all ${
                                                errors.password 
                                                    ? 'border-red-500 focus-visible:ring-red-500' 
                                                    : 'border-gray-300 focus-visible:ring-[#125e3b]'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#125e3b] focus:outline-none transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <Button 
                                    type="submit" 
                                    className="w-full h-12 bg-[#125e3b] hover:bg-[#0f4d30] text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]" 
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Signing you in...
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </>
                                    )}
                                </Button>

                                {/* Divider */}
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-gray-500 font-medium">
                                            New to ElWaseet?
                                        </span>
                                    </div>
                                </div>

                                {/* Sign Up Link */}
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        Don't have an account?{' '}
                                        <Link 
                                            to={ROUTES.REGISTER} 
                                            className="text-[#125e3b] hover:text-[#0f4d30] font-semibold hover:underline transition-colors"
                                        >
                                            Create one now
                                        </Link>
                                    </p>
                                </div>
                            </form>

                            {/* Trust Indicators */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Shield className="w-3 h-3" />
                                        <span>SSL Secured</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        <span>GDPR Compliant</span>
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