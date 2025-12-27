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
    Clock,
    DollarSign,
} from 'lucide-react';
import { ROUTES } from '../../lib/constants';
import ScrollFloat from '../../components/ui/ScrollFloat';
import RotatingText from '../../components/ui/RotatingText';

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

const AnimatedCounter = ({ end, duration = 2000 }) => {
// ... existing AnimatedCounter code (just context for diff) ...
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        let animationFrame;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;
            
            if (progress < duration) {
                // Ease out quart
                const ease = 1 - Math.pow(1 - (progress / duration), 4);
                setCount(Math.floor(end * ease));
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return <span>{count.toLocaleString()}</span>;
};

export const Landing = () => {
    const [stats, setStats] = useState({
        users: 0,
        activeTasks: 0,
        moneyTransfers: 0
    });

    useEffect(() => {
        // In a real app, this would be an API call
        // axios.get(API_ENDPOINTS.STATS).then...
        
        // Simulating API latency
        const timer = setTimeout(() => {
            setStats({
                users: 12543,
                activeTasks: 450,
                moneyTransfers: 8900
            });
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const features = [
        {
            icon: Shield,
            title: 'Secure Escrow',
            description: 'Your payments are held safely until job completion',
        },
        {
            icon: Users,
            title: 'Verified Providers',
            description: 'All service providers are verified and rated',
        },
        {
            icon: Clock,
            title: 'Quick Matching',
            description: 'Get matched with local providers instantly',
        },
        {
            icon: DollarSign,
            title: 'Fair Pricing',
            description: 'Compare quotes and choose the best value',
        },
    ];

    const steps = [
        {
            number: '1',
            title: 'Post Your Job',
            description: 'Describe what you need and set your budget',
        },
        {
            number: '2',
            title: 'Review Applications',
            description: 'Get quotes from qualified local providers',
        },
        {
            number: '3',
            title: 'Hire & Pay',
            description: 'Choose your provider and funds are held in escrow',
        },
        {
            number: '4',
            title: 'Confirm Completion',
            description: 'Release payment once the job is done',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#163248] to-blue-800 text-white min-h-screen flex items-center py-20 overflow-hidden p-[7rem]">
                <div className="absolute inset-0 z-0">
                </div>
                <div claame="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 text-center md:text-left">
                            <ScrollReveal direction="left">
                                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                    Find Local <br></br>
                                    <RotatingText 
                                        items={["Service Providers", "Jobs & Tasks", "Service Providers", "Jobs & Tasks"]}
                                        className="text-blue-300"
                                    />
                                    <br /> You Can Trust
                                </h1>
                                <p className="text-xl md:text-2xl mb-8 text-blue-100">
                                    Connect with verified plumbers, cleaners, tutors, and more.
                                    Secure payments with built-in escrow protection.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
                                    <Link to={ROUTES.REGISTER}>
                                        <Button className="group relative bg-[#bf9a47] text-white hover:bg-[#8c7034] text-xl py-6 px-10 transition-all duration-300 ease-out hover:scale-105 active:scale-105 overflow-hidden">
                                            <span className="relative z-10 flex items-center">
                                                Get Started
                                                <ArrowRight className="ml-2 w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-[200%]" />
                                            </span>
                                        </Button>
                                    </Link>
                                    <Link to={ROUTES.LOGIN}>
                                        <Button variant="outline" className="group bg-[#1d925c] text-white border-[#1d925c] hover:bg-[#125e3b] hover:border-[#125e3b] text-xl py-6 px-10 transition-all duration-300 ease-out hover:scale-105 active:scale-105 hover:text-white">
                                            Sign In
                                        </Button>
                                    </Link>
                                </div>
                            </ScrollReveal>
                        </div>
                        <div className="flex-1 flex justify-center md:justify-end">
                            <ScrollReveal delay={200} direction="right">
                                <div className="w-64 h-64 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-blue-900 font-bold text-3xl">Logo</span>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <ScrollReveal>
                    <ScrollFloat
                        animationDuration={1}
                        ease='back.inOut(2)'
                        scrollStart='center bottom+=50%'
                        scrollEnd='bottom bottom-=40%'
                        stagger={0.03}
                    >
                        Our Stats
                    </ScrollFloat>
                        <p className="text-lg md:text-2xl text-center mb-12 text-gray-600">
                            Here are some of our achievements and milestones.
                        </p>
                    </ScrollReveal>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Users Card */}
                        <ScrollReveal delay={100}>
                            <Card className="animated-hover-border shadow-md bg-white hover:shadow-lg transition-shadow">
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                        <Users className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-4xl font-bold text-gray-900 mb-2">
                                        <AnimatedCounter end={stats.users} />+
                                    </h3>
                                    <p className="text-lg text-gray-600 font-medium">Active Users</p>
                                </CardContent>
                            </Card>
                        </ScrollReveal>

                        {/* Tasks Card */}
                        <ScrollReveal delay={200}>
                            <Card className="animated-hover-border shadow-md bg-white hover:shadow-lg transition-shadow">
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                        <Briefcase className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-4xl font-bold text-gray-900 mb-2">
                                        <AnimatedCounter end={stats.activeTasks} />
                                    </h3>
                                    <p className="text-lg text-gray-600 font-medium">Tasks in Progress</p>
                                </CardContent>
                            </Card>
                        </ScrollReveal>

                        {/* Money Transfer Card */}
                        <ScrollReveal delay={300}>
                            <Card className="animated-hover-border shadow-md bg-white hover:shadow-lg transition-shadow">
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                                        <DollarSign className="w-8 h-8 text-yellow-600" />
                                    </div>
                                    <h3 className="text-4xl font-bold text-gray-900 mb-2">
                                        <AnimatedCounter end={stats.moneyTransfers} />
                                    </h3>
                                    <p className="text-lg text-gray-600 font-medium">Transactions Processed</p>
                                </CardContent>
                            </Card>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <ScrollReveal>
                            <ScrollFloat
                                animationDuration={1}
                                ease='back.inOut(2)'
                                scrollStart='center bottom+=50%'
                                scrollEnd='bottom bottom-=40%'
                                stagger={0.03}
                            >
                                Why Choose ServiceHub?
                            </ScrollFloat>
                            <p className="text-xl text-muted-foreground">
                                The safest and easiest way to hire local service providers
                            </p>
                        </ScrollReveal>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <ScrollReveal key={index} delay={index * 100}>
                                    <Card className="animated-hover-border transition-colors">
                                        <CardContent className="pt-6 text-center">
                                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                                <Icon className="w-8 h-8 text-primary" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-card-foreground mb-2">
                                                {feature.title}
                                            </h3>
                                            <p className="text-muted-foreground">
                                                {feature.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-muted/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <ScrollReveal>
                            <ScrollFloat
                                animationDuration={1}
                                ease='back.inOut(2)'
                                scrollStart='center bottom+=50%'
                                scrollEnd='bottom bottom-=40%'
                                stagger={0.03}
                            >
                                How It Works
                            </ScrollFloat>
                                <p className="text-xl text-muted-foreground">
                                    Get your job done in four simple steps
                                </p>
                        </ScrollReveal>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                <ScrollReveal delay={index * 150}>
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-[#bf9a47] text-black-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-4 relative z-10">
                                            {step.number}
                                        </div>
                                        <h3 className="text-xl font-semibold text-foreground mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </div>
                                </ScrollReveal>
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-8 left-1/2 w-[calc(100%+2rem)] h-1 bg-[#bf9a47] opacity-0" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <ScrollReveal>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl mb-8 text-blue-100">
                            Join thousands of customers and providers on ServiceHub today
                        </p>
                        <Link to={ROUTES.REGISTER}>
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8">
                                Create Free Account
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    );
};

