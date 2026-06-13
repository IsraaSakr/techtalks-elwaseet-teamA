import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../lib/constants';
import Antigravity from '../../components/ui/Antigravity';

export const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyOTP } = useAuth();

    const email = location.state?.email || '';
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const [verificationStatus, setVerificationStatus] = useState('idle'); // 'idle', 'success', 'error'
    useEffect(() => {
        if (!email) {
            navigate(ROUTES.REGISTER);
        }
    }, [email, navigate]);
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setVerificationStatus('idle');

        if (otp.length !== 6) {
            return;
        }

        setLoading(true);

        try {
            const result = await verifyOTP(email, otp);

            if (result.success) {
                setVerificationStatus('success');
                toast.success('Email verified! Please log in.');
                setTimeout(() => {
                    navigate(ROUTES.LOGIN);
                }, 1500);
            }
        } catch (error) {
            setVerificationStatus('error');
            toast.error(error.message || 'Verification failed. Please try again.');
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;

        setVerificationStatus('idle'); 
        setResendCooldown(60); 

        try {
            console.log('Resending OTP to:', email);
        } catch (error) {
            toast.error('Failed to resend code. Please try again.');
            setResendCooldown(0);
            console.log(error)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-[#163248] to-blue-800">
            <div className="absolute inset-0 z-0 overflow-hidden">
                <Antigravity
                    count={400}
                    magnetRadius={6}
                    ringRadius={17}
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
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-blue-100 p-3">
                            <CheckCircle className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">
                        Verify your email
                    </CardTitle>
                    <CardDescription className="text-center">
                        We've sent a 6-digit code to<br />
                        <span className="font-medium text-gray-900">{email}</span>
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="space-y-4">
                            <div className="flex justify-center gap-2">
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <Input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        value={otp[index] || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (!/^\d*$/.test(value)) return;
                                            
                                            if (verificationStatus === 'error') setVerificationStatus('idle');

                                            const newOtp = otp.split('');
                                            newOtp[index] = value;
                                            const newOtpStr = newOtp.join('');
                                            setOtp(newOtpStr);

                                            if (value && index < 5) {
                                                const nextInput = document.querySelector(`#otp-${index + 1}`);
                                                if (nextInput) nextInput.focus();
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Backspace' && !otp[index] && index > 0) {
                                                const prevInput = document.querySelector(`#otp-${index - 1}`);
                                                if (prevInput) {
                                                    prevInput.focus();
                                                }
                                            }
                                        }}
                                        onPaste={(e) => {
                                            e.preventDefault();
                                            setVerificationStatus('idle'); 
                                            const pasteData = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '');
                                            if (pasteData) {
                                                setOtp(pasteData);
                                                const focusIndex = Math.min(pasteData.length, 5);
                                                const focusInput = document.querySelector(`#otp-${focusIndex}`);
                                                if (focusInput) focusInput.focus();
                                                else {
                                                    const lastInput = document.querySelector(`#otp-5`);
                                                    if(lastInput) lastInput.focus();
                                                }
                                            }
                                        }}
                                        className={`w-12 h-12 sm:w-16 sm:h-16 text-center text-2xl sm:text-4xl font-bold border-2 rounded-lg shadow-sm transition-all duration-200 ease-in-out 
                                            ${verificationStatus === 'success' 
                                                ? 'border-green-500 bg-green-50 text-green-700' 
                                                : verificationStatus === 'error'
                                                    ? 'border-red-500 bg-red-50 text-red-700 animate-shake'
                                                    : otp[index] 
                                                        ? 'border-blue-500 scale-110 shadow-md bg-blue-50 text-blue-700' 
                                                        : 'bg-white border-gray-200 focus:border-blue-500 focus:scale-105'
                                            }`}
                                        disabled={loading}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 text-center">
                                Enter the 6-digit code
                            </p>
                        </div>

                        <Button type="submit" className="w-full bg-[#125e3b] hover:bg-[#125e3b]/80" disabled={loading || otp.length !== 6}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                </>
                            ) : (
                                'Verify Email'
                            )}
                        </Button>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Didn't receive the code?{' '}
                                {resendCooldown > 0 ? (
                                    <span className="text-gray-400">
                                        Resend in {resendCooldown}s
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        Resend code
                                    </button>
                                )}
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
