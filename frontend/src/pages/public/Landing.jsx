import '../../styles/landing-animations.css';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import {
    Briefcase,
    Shield,
    Users,
    CheckCircle,
    ArrowRight,
    Star,
    DollarSign,
    Zap,
    Award,
    TrendingUp,
    Play,
    ChevronLeft,
    ChevronRight,
    Wrench,
    Sparkles,
    Home,
    GraduationCap,
    Car,
    Scissors,
    Quote,
    Clock,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { ROUTES } from '../../lib/constants';
import ScrollFloat from '../../components/ui/ScrollFloat';
import RotatingText from '../../components/ui/RotatingText';

// ============= REUSABLE COMPONENTS =============

const ScrollReveal = ({ children, delay = 0, direction = 'up' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const currentRef = ref.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        setIsVisible(true);
                    }, delay);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px',
            }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [delay]);

    const getDirectionClass = () => {
        switch (direction) {
            case 'left':
                return isVisible ? 'translate-x-0' : '-translate-x-20';
            case 'right':
                return isVisible ? 'translate-x-0' : 'translate-x-20';
            case 'down':
                return isVisible ? 'translate-y-0' : '-translate-y-12';
            case 'up':
            default:
                return isVisible ? 'translate-y-0' : 'translate-y-12';
        }
    };

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out transform ${
                isVisible ? 'opacity-100' : 'opacity-0'
            } ${getDirectionClass()}`}
        >
            {children}
        </div>
    );
};

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const currentRef = ref.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let startTime;
                    let animationFrame;

                    const animate = (currentTime) => {
                        if (!startTime) startTime = currentTime;
                        const progress = currentTime - startTime;
                        
                        if (progress < duration) {
                            const ease = 1 - Math.pow(1 - (progress / duration), 4);
                            setCount(Math.floor(end * ease));
                            animationFrame = requestAnimationFrame(animate);
                        } else {
                            setCount(end);
                        }
                    };

                    animationFrame = requestAnimationFrame(animate);
                    return () => cancelAnimationFrame(animationFrame);
                }
            },
            { threshold: 0.1 }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [end, duration, hasAnimated]);

    return (
        <span ref={ref}>
            {count.toLocaleString()}
            {suffix}
        </span>
    );
};

// ============= MAIN COMPONENT =============

export const Landing = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [openFaq, setOpenFaq] = useState(null);

    // Data
    const stats = {
        users: 12543,
        activeTasks: 450,
        moneyTransfers: 8900,
    };

    const features = [
        {
            icon: Shield,
            title: 'Secure Escrow Payment',
            description: 'Your money stays protected in escrow until you confirm the job is complete',
            detailedDescription: 'We hold your payment safely and only release it when you approve the completed work. Full refund if you\'re not satisfied.',
            color: 'blue',
        },
        {
            icon: Award,
            title: 'Trusted Professionals',
            description: 'Every provider is verified, background-checked, and rated by real customers',
            detailedDescription: 'All providers undergo identity verification and background checks. Read real reviews from customers like you.',
            color: 'green',
        },
        {
            icon: Zap,
            title: 'Instant Matching',
            description: 'Get connected with qualified local providers in minutes, not days',
            detailedDescription: 'Post your job and receive qualified applications within hours. Compare quotes and hire the same day.',
            color: 'yellow',
        },
        {
            icon: TrendingUp,
            title: 'Transparent Pricing',
            description: 'Compare multiple quotes side-by-side and choose what fits your budget',
            detailedDescription: 'No hidden fees. See exactly what you\'ll pay upfront. Providers compete for your business.',
            color: 'purple',
        },
    ];

    const steps = [
        {
            number: '1',
            title: 'Post Your Job',
            description: 'Tell us what you need done, when, and your budget. Takes less than 2 minutes.',
            details: 'Describe your project, upload photos if needed, set your budget and timeline. It\'s completely free to post.',
            icon: Briefcase,
        },
        {
            number: '2',
            title: 'Get Applications',
            description: 'Receive quotes from verified providers. Check their reviews and portfolios.',
            details: 'Review applications from qualified professionals. See their ratings, past work, and pricing. Ask questions before hiring.',
            icon: Users,
        },
        {
            number: '3',
            title: 'Hire Securely',
            description: 'Choose your provider and pay into escrow. Your money is safe until job completion.',
            details: 'Select the best provider for your needs. Your payment is held securely and only released when you approve the work.',
            icon: Shield,
        },
        {
            number: '4',
            title: 'Release Payment',
            description: 'Confirm the work is done right. Provider gets paid, you leave a review.',
            details: 'Inspect the completed work. If satisfied, release payment with one click. Leave a review to help others.',
            icon: CheckCircle,
        },
    ];

    const testimonials = [
        {
            name: 'Sarah Mitchell',
            role: 'Homeowner',
            image: '👩‍💼',
            rating: 5,
            text: 'Found an amazing plumber within 3 hours! The escrow system made me feel completely safe. Best experience I\'ve had hiring help.',
            jobType: 'Plumbing Repair',
        },
        {
            name: 'Ahmad Hassan',
            role: 'Small Business Owner',
            image: '👨‍💼',
            rating: 5,
            text: 'Hired a cleaner for my office space. Super professional, and I love that I could see reviews before choosing. Will use again!',
            jobType: 'Office Cleaning',
        },
        {
            name: 'Maria Rodriguez',
            role: 'Parent',
            image: '👩‍🏫',
            rating: 5,
            text: 'The tutor we found through ElWaseet has been incredible for my daughter. The platform made it so easy to compare qualifications.',
            jobType: 'Math Tutoring',
        },
        {
            name: 'David Chen',
            role: 'Property Manager',
            image: '👨‍💻',
            rating: 5,
            text: 'I manage 15 properties and use ElWaseet for all maintenance. Fast, secure, and reliable. Saved me so much time and hassle.',
            jobType: 'Multiple Services',
        },
    ];

    const serviceCategories = [
        { icon: Wrench, name: 'Plumbing', providers: '234+', color: 'blue' },
        { icon: Sparkles, name: 'Cleaning', providers: '456+', color: 'purple' },
        { icon: Zap, name: 'Electrical', providers: '189+', color: 'yellow' },
        { icon: Home, name: 'Carpentry', providers: '167+', color: 'green' },
        { icon: GraduationCap, name: 'Tutoring', providers: '389+', color: 'blue' },
        { icon: Car, name: 'Auto Repair', providers: '145+', color: 'red' },
        { icon: Scissors, name: 'Beauty', providers: '278+', color: 'pink' },
        { icon: Users, name: 'Moving', providers: '123+', color: 'orange' },
    ];

    const faqs = [
        {
            question: 'How does the escrow payment system work?',
            answer: 'When you hire a provider, your payment is held securely in our escrow account. The provider only receives payment after you confirm the job is completed to your satisfaction. If there\'s an issue, you can open a dispute and we\'ll help resolve it.',
        },
        {
            question: 'Are all providers background-checked?',
            answer: 'Yes! Every provider must complete identity verification and pass a background check before they can accept jobs. We also encourage you to read reviews from other customers.',
        },
        {
            question: 'What if I\'m not satisfied with the work?',
            answer: 'Your satisfaction is guaranteed. If you\'re not happy with the completed work, you can request revisions or open a dispute. Our support team will review the case and ensure a fair resolution. You won\'t pay until you\'re satisfied.',
        },
        {
            question: 'How quickly can I find a provider?',
            answer: 'Most jobs receive their first application within 1-2 hours. You can review applications as they come in and hire someone the same day. For urgent jobs, you can mark them as "urgent" to attract faster responses.',
        },
        {
            question: 'What fees does ElWaseet charge?',
            answer: 'Posting jobs is completely free for customers. We charge a small service fee (included in the quote) to providers. You\'ll see the total amount upfront with no hidden costs.',
        },
    ];

    // Handlers
    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            yellow: 'bg-yellow-100 text-yellow-600',
            purple: 'bg-purple-100 text-purple-600',
            red: 'bg-red-100 text-red-600',
            pink: 'bg-pink-100 text-pink-600',
            orange: 'bg-orange-100 text-orange-600',
        };
        return colors[color] || colors.blue;
    };

    const getGradientClasses = (color) => {
        const gradients = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            yellow: 'from-yellow-500 to-yellow-600',
            purple: 'from-purple-500 to-purple-600',
            red: 'from-red-500 to-red-600',
            pink: 'from-pink-500 to-pink-600',
            orange: 'from-orange-500 to-orange-600',
        };
        return gradients[color] || gradients.blue;
    };

    // Auto-rotate testimonials
    useEffect(() => {
        const timer = setInterval(() => {
            nextTestimonial();
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen overflow-x-hidden">
            {/* ============= HERO SECTION ============= */}
            <section className="relative bg-gradient-to-br from-[#163248] via-blue-900 to-blue-800 text-white min-h-screen flex items-center py-20 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 text-center md:text-left">
                            <ScrollReveal direction="left">
                                {/* Trust Badge */}
                                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
                                    <span className="text-sm font-medium">Trusted by 12,000+ users</span>
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-300 border-2 border-white"></div>
                                        <div className="w-6 h-6 rounded-full bg-green-300 border-2 border-white"></div>
                                        <div className="w-6 h-6 rounded-full bg-yellow-300 border-2 border-white"></div>
                                    </div>
                                </div>

                                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                                    Hire Local{' '}
                                    <RotatingText 
                                        items={["Plumbers", "Cleaners", "Tutors", "Electricians"]}
                                        className="text-[#bf9a47]"
                                    />
                                    <br />
                                    <span className="text-blue-200">With Confidence</span>
                                </h1>
                                <p className="text-xl md:text-2xl mb-10 text-blue-100 leading-relaxed">
                                    Post a job, review qualified providers, and pay securely. 
                                    <br />
                                    <span className="font-semibold text-white">Your money is protected until the work is done.</span>
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-6">
                                    <Link to={ROUTES.REGISTER}>
                                        <Button className="group relative bg-[#bf9a47] text-white hover:bg-[#a88840] text-lg py-7 px-10 rounded-lg shadow-2xl transition-all duration-300 ease-out hover:scale-105 hover:shadow-yellow-500/50">
                                            <span className="relative z-10 flex items-center font-semibold">
                                                Get Started Free
                                                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                            </span>
                                        </Button>
                                    </Link>
                                    <Button className="group bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 text-lg py-7 px-10 rounded-lg transition-all duration-300 ease-out hover:scale-105">
                                        <Play className="w-5 h-5 mr-2" />
                                        <span className="font-semibold">Watch Demo</span>
                                    </Button>
                                </div>

                                {/* Quick stats under buttons */}
                                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-blue-200 justify-center md:justify-start">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                        <span>No signup required to browse</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                        <span>100% money-back guarantee</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-yellow-400" />
                                        <span className="font-semibold text-yellow-300">450 jobs posted this week</span>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                        <div className="flex-1 flex justify-center md:justify-end">
                            <ScrollReveal delay={200} direction="right">
                                <div className="relative">
                                    {/* Main logo circle with pulse effect */}
                                    <div className="w-[350px] h-[350px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px] bg-gradient-to-br from-[#bf9a47] to-yellow-300 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden animate-pulse-slow">
                                        <img src="../../images/elwaseet.png" alt="ElWaseet Logo" className="relative z-10 w-65 h-65 md:w-73 md:h-73 lg:w-89 lg:h-89 object-contain" />
                                    {/* Orbiting elements */}
                                    <div className="absolute inset-0 z-20">
                                        {/* Orbit 1 - Star Icon */}
                                        <div className="absolute top-1/2 left-1/2 w-full h-full animate-spin-slow" style={{ animationDuration: '10s' }}>
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                                <Star className="w-10 h-10 text-blue-400 fill-blue-400 drop-shadow-lg animate-pulse" />
                                            </div>
                                        </div>
                                        
                                        {/* Orbit 2 - Shield Icon */}
                                        <div className="absolute top-1/2 left-1/2 w-full h-full animate-spin-slow" style={{ animationDuration: '10s' }}>
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                                                <Shield className="w-10 h-10 text-green-400 drop-shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }} />
                                            </div>
                                        </div>
                                        
                                        {/* Orbit 3 - Zap Icon */}
                                        <div className="absolute top-1/2 left-1/2 w-full h-full animate-spin-slow" style={{ animationDuration: '20s' }}>
                                            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                                <Zap className="w-10 h-10 text-yellow-400 fill-yellow-400 drop-shadow-lg animate-pulse" style={{ animationDelay: '1s' }} />
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    {/* Floating badges */}
                                    <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-xl animate-bounce">
                                        <Shield className="w-8 h-8 text-green-600" />
                                    </div>
                                    <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-4 shadow-xl animate-bounce animation-delay-1000">
                                        <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                                    </div>
                                    <div className="absolute top-1/2 -right-8 bg-white rounded-full p-3 shadow-xl animate-bounce animation-delay-2000">
                                        <Zap className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============= STATS SECTION ============= */}
            <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <ScrollReveal>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            <ScrollFloat
                                animationDuration={1}
                                ease='back.inOut(2)'
                                scrollStart='center bottom+=50%'
                                scrollEnd='bottom bottom-=40%'
                                stagger={0.03}
                            >
                                Join a Growing Community
                            </ScrollFloat>
                        </h2>
                        <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
                            Thousands of customers and providers trust ElWaseet every day to get things done
                        </p>
                    </ScrollReveal>
                    <div className="grid md:grid-cols-3 gap-8">
                        <ScrollReveal delay={100}>
                            <Card className="group relative overflow-hidden shadow-xl bg-white hover:shadow-2xl transition-all duration-300 border-0 hover:-translate-y-2">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <CardContent className="relative flex flex-col items-center justify-center p-10 text-center">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                        <Users className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-5xl font-bold text-gray-900 mb-3">
                                        <AnimatedCounter end={stats.users} suffix="+" />
                                    </h3>
                                    <p className="text-lg text-gray-600 font-semibold">Active Members</p>
                                    <p className="text-sm text-gray-500 mt-2">Growing every day</p>
                                </CardContent>
                            </Card>
                        </ScrollReveal>

                        <ScrollReveal delay={200}>
                            <Card className="group relative overflow-hidden shadow-xl bg-white hover:shadow-2xl transition-all duration-300 border-0 hover:-translate-y-2">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <CardContent className="relative flex flex-col items-center justify-center p-10 text-center">
                                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                        <Briefcase className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-5xl font-bold text-gray-900 mb-3">
                                        <AnimatedCounter end={stats.activeTasks} />
                                    </h3>
                                    <p className="text-lg text-gray-600 font-semibold">Jobs in Progress</p>
                                    <p className="text-sm text-gray-500 mt-2">Right now</p>
                                </CardContent>
                            </Card>
                        </ScrollReveal>

                        <ScrollReveal delay={300}>
                            <Card className="group relative overflow-hidden shadow-xl bg-white hover:shadow-2xl transition-all duration-300 border-0 hover:-translate-y-2">
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <CardContent className="relative flex flex-col items-center justify-center p-10 text-center">
                                    <div className="w-20 h-20 bg-gradient-to-br from-[#bf9a47] to-yellow-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                        <DollarSign className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-5xl font-bold text-gray-900 mb-3">
                                        <AnimatedCounter end={stats.moneyTransfers} />
                                    </h3>
                                    <p className="text-lg text-gray-600 font-semibold">Secure Transactions</p>
                                    <p className="text-sm text-gray-500 mt-2">Protected by escrow</p>
                                </CardContent>
                            </Card>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* ============= TESTIMONIALS SECTION (NEW) ============= */}
            <section className="py-20 bg-gradient-to-b from-white to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <ScrollReveal>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                <ScrollFloat
                                    animationDuration={1}
                                    ease='back.inOut(2)'
                                    scrollStart='center bottom+=50%'
                                    scrollEnd='bottom bottom-=40%'
                                    stagger={0.03}
                                >
                                    What Our Users Say
                                </ScrollFloat>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Real stories from real people who found success on ElWaseet
                            </p>
                        </ScrollReveal>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        <ScrollReveal>
                            <Card className="border-0 shadow-2xl bg-white overflow-hidden">
                                <CardContent className="p-8 md:p-12">
                                    <div className="flex flex-col items-center text-center">
                                        {/* Quote Icon */}
                                        <Quote className="w-12 h-12 text-[#bf9a47] mb-6 opacity-50" />
                                        
                                        {/* Stars */}
                                        <div className="flex gap-1 mb-6">
                                            {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                                <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                                            ))}
                                        </div>

                                        {/* Testimonial Text */}
                                        <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed italic">
                                            "{testimonials[currentTestimonial].text}"
                                        </p>

                                        {/* User Info */}
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="text-6xl">{testimonials[currentTestimonial].image}</div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-lg">
                                                    {testimonials[currentTestimonial].name}
                                                </p>
                                                <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                                                <p className="text-sm text-[#bf9a47] font-semibold mt-1">
                                                    {testimonials[currentTestimonial].jobType}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Navigation Buttons */}
                            <div className="flex justify-center items-center gap-4 mt-8">
                                <button
                                    onClick={prevTestimonial}
                                    className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-gray-200"
                                    aria-label="Previous testimonial"
                                >
                                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                                </button>
                                
                                {/* Dots */}
                                <div className="flex gap-2">
                                    {testimonials.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentTestimonial(index)}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                index === currentTestimonial
                                                    ? 'bg-[#bf9a47] w-8'
                                                    : 'bg-gray-300 hover:bg-gray-400'
                                            }`}
                                            aria-label={`Go to testimonial ${index + 1}`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={nextTestimonial}
                                    className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-gray-200"
                                    aria-label="Next testimonial"
                                >
                                    <ChevronRight className="w-6 h-6 text-gray-700" />
                                </button>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* ============= FEATURES SECTION (ENHANCED) ============= */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <ScrollReveal>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                <ScrollFloat
                                    animationDuration={1}
                                    ease='back.inOut(2)'
                                    scrollStart='center bottom+=50%'
                                    scrollEnd='bottom bottom-=40%'
                                    stagger={0.03}
                                >
                                    Why Choose ElWaseet?
                                </ScrollFloat>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                We've built the most secure and transparent platform for hiring local service providers
                            </p>
                        </ScrollReveal>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            const [isExpanded, setIsExpanded] = useState(false);
                            
                            return (
                                <ScrollReveal key={index} delay={index * 100}>
                                    <Card className="group h-full border-2 border-gray-100 hover:border-[#bf9a47]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
                                        onClick={() => setIsExpanded(!isExpanded)}
                                    >
                                        <CardContent className="pt-8 pb-8 px-6 text-center h-full flex flex-col">
                                            <div className={`inline-flex items-center justify-center w-20 h-20 ${getColorClasses(feature.color)} rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg`}>
                                                <Icon className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                                {feature.title}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed mb-4">
                                                {feature.description}
                                            </p>
                                            {isExpanded && (
                                                <p className="text-sm text-gray-500 mt-2 border-t border-gray-200 pt-4">
                                                    {feature.detailedDescription}
                                                </p>
                                            )}
                                            <div className="mt-auto pt-4">
                                                <span className="text-[#bf9a47] text-sm font-semibold group-hover:underline">
                                                    {isExpanded ? 'Show less' : 'Learn more →'}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ============= SERVICE CATEGORIES (NEW) ============= */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <ScrollReveal>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                <ScrollFloat
                                    animationDuration={1}
                                    ease='back.inOut(2)'
                                    scrollStart='center bottom+=50%'
                                    scrollEnd='bottom bottom-=40%'
                                    stagger={0.03}
                                >
                                    Popular Services
                                </ScrollFloat>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Browse hundreds of verified providers across all service categories
                            </p>
                        </ScrollReveal>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {serviceCategories.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <ScrollReveal key={index} delay={index * 50}>
                                    <Link to={ROUTES.REGISTER}>
                                        <Card className="group border-2 border-gray-100 hover:border-[#bf9a47]/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                                            <CardContent className="p-6 text-center">
                                                <div className={`w-16 h-16 bg-gradient-to-br ${getGradientClasses(category.color)} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform shadow-md`}>
                                                    <Icon className="w-8 h-8 text-white" />
                                                </div>
                                                <h3 className="font-bold text-gray-900 mb-2">{category.name}</h3>
                                                <p className="text-sm text-gray-600">{category.providers} providers</p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </ScrollReveal>
                            );
                        })}
                    </div>

                    <div className="text-center mt-12">
                        <Link to={ROUTES.REGISTER}>
                            <Button className="bg-[#bf9a47] hover:bg-[#a88840] text-white px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
                                View All Categories
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ============= HOW IT WORKS (ENHANCED) ============= */}
            <section className="py-24 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <ScrollReveal>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                <ScrollFloat
                                    animationDuration={1}
                                    ease='back.inOut(2)'
                                    scrollStart='center bottom+=50%'
                                    scrollEnd='bottom bottom-=40%'
                                    stagger={0.03}
                                >
                                    How It Works
                                </ScrollFloat>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                From posting to payment, we've made hiring simple and secure
                            </p>
                        </ScrollReveal>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                        {/* Connection line for desktop */}
                        <div className="hidden lg:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-[#bf9a47] via-yellow-400 to-green-500" 
                            style={{ width: 'calc(100% - 8rem)', left: '4rem' }}>
                        </div>
                        
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = activeStep === index;
                            
                            return (
                                <div 
                                    key={index} 
                                    className="relative"
                                    onMouseEnter={() => setActiveStep(index)}
                                >
                                    <ScrollReveal delay={index * 150}>
                                        <div className={`flex flex-col items-center text-center transition-all duration-300 ${isActive ? 'scale-105' : ''}`}>
                                            <div className="relative mb-6">
                                                <div className={`w-24 h-24 bg-gradient-to-br from-[#bf9a47] to-yellow-600 text-white rounded-2xl flex items-center justify-center shadow-2xl relative z-10 transition-all duration-300 ${
                                                    isActive ? 'scale-110 shadow-yellow-500/50' : ''
                                                }`}>
                                                    <Icon className="w-12 h-12" />
                                                </div>
                                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#bf9a47] z-20">
                                                    <span className="text-sm font-bold text-[#bf9a47]">{step.number}</span>
                                                </div>
                                                {/* Pulse ring when active */}
                                                {isActive && (
                                                    <div className="absolute inset-0 rounded-2xl border-4 border-[#bf9a47] animate-ping opacity-75"></div>
                                                )}
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed mb-3">
                                                {step.description}
                                            </p>
                                            {/* Show details on hover */}
                                            {isActive && (
                                                <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2">
                                                    {step.details}
                                                </p>
                                            )}
                                        </div>
                                    </ScrollReveal>
                                </div>
                            );
                        })}
                    </div>

                    {/* Mobile view - Accordion style */}
                    <div className="lg:hidden mt-12 space-y-4">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isOpen = activeStep === index;
                            
                            return (
                                <Card 
                                    key={index}
                                    className="cursor-pointer border-2 hover:border-[#bf9a47]/30 transition-all"
                                    onClick={() => setActiveStep(isOpen ? -1 : index)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-[#bf9a47] to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 text-lg">{step.title}</h3>
                                                {!isOpen && (
                                                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                                                )}
                                            </div>
                                            {isOpen ? (
                                                <ChevronUp className="w-6 h-6 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                        {isOpen && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <p className="text-gray-600 mb-2">{step.description}</p>
                                                <p className="text-sm text-gray-500">{step.details}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ============= FAQ SECTION (NEW) ============= */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <ScrollReveal>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-xl text-gray-600">
                                Everything you need to know about using ElWaseet
                            </p>
                        </ScrollReveal>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => {
                            const isOpen = openFaq === index;
                            return (
                                <ScrollReveal key={index} delay={index * 50}>
                                    <Card 
                                        className="cursor-pointer border-2 border-gray-100 hover:border-[#bf9a47]/30 transition-all"
                                        onClick={() => toggleFaq(index)}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start gap-4">
                                                <h3 className="font-bold text-gray-900 text-lg flex-1">
                                                    {faq.question}
                                                </h3>
                                                <div className="flex-shrink-0">
                                                    {isOpen ? (
                                                        <ChevronUp className="w-6 h-6 text-[#bf9a47]" />
                                                    ) : (
                                                        <ChevronDown className="w-6 h-6 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                            {isOpen && (
                                                <p className="text-gray-600 mt-4 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </ScrollReveal>
                            );
                        })}
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-gray-600 mb-4">Still have questions?</p>
                        <Button variant="outline" className="border-2 border-[#bf9a47] text-[#bf9a47] hover:bg-[#bf9a47] hover:text-white">
                            Contact Support
                        </Button>
                    </div>
                </div>
            </section>

            {/* ============= CTA SECTION (ENHANCED) ============= */}
            <section className="py-24 bg-gradient-to-br from-[#163248] via-blue-900 to-blue-800 text-white relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                </div>
                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <ScrollReveal>
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Ready to Find Your Perfect Provider?
                        </h2>
                        <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed">
                            Join thousands of happy customers who trust ElWaseet for all their service needs. 
                            Post your first job in under 2 minutes.
                        </p>

                        {/* Dual CTA */}
                        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
                            <div className="flex-1 max-w-md">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                                    <h3 className="text-2xl font-bold mb-2">Need a Service?</h3>
                                    <p className="text-blue-200 mb-4">Post a job and get quotes from verified providers</p>
                                    <Link to={ROUTES.REGISTER}>
                                        <Button size="lg" className="w-full bg-[#bf9a47] hover:bg-[#a88840] text-white text-lg px-8 py-6 rounded-lg shadow-2xl transition-all duration-300 hover:scale-105">
                                            Post a Job Free
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="flex-1 max-w-md">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                                    <h3 className="text-2xl font-bold mb-2">Are You a Provider?</h3>
                                    <p className="text-blue-200 mb-4">Join our network and find new customers</p>
                                    <Link to={ROUTES.REGISTER}>
                                        <Button size="lg" variant="outline" className="w-full border-2 border-white text-blue-900 hover:bg-white hover:text-blue-900 text-lg px-8 py-6 rounded-lg transition-all duration-300 hover:scale-105">
                                            Start Earning
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <p className="text-blue-200 text-sm mb-8">No credit card required • Free to get started</p>

                        {/* Trust indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-8 text-blue-200">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                <span>100% Secure</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                <span>4.8/5 Average Rating</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                <span>Money-Back Guarantee</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span>24/7 Support</span>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    );
};
