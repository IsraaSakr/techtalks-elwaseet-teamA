import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Skeleton } from '../../components/ui/skeleton';
import { Separator } from '../../components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { 
    ArrowLeft, 
    MapPin, 
    Star, 
    Briefcase, 
    CheckCircle, 
    Share2,
    Heart,
    Calendar,
    MessageCircle,
    Clock,
    Award,
    DollarSign
} from 'lucide-react';
import { providersAPI } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import { ROUTES } from '../../lib/constants';

export const ProviderProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProvider();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchProvider = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await providersAPI.getById(id);
            setProvider(data.provider);
        } catch (error) {
            console.error('Error fetching provider:', error);
            setError(error.message || 'Failed to load provider');
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleMessage = () => {
        // Open WhatsApp chat
        const phoneNumber = provider.phone || '0096170000000'; // Fallback or mock
        const message = `Hello ${provider.fullName || provider.name}, I found your profile on ElWaseet.`;
        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    // Book Now button removed as requested

    if (loading) {
        return <LoadingState />;
    }

    if (error || !provider) {
        return <ErrorState error={error} onRetry={fetchProvider} navigate={navigate} />;
    }


    return (
        <div className="min-h-screen bg-muted/40 pb-6">
            {/* Sticky Header */}
            <ProfileHeader navigate={navigate} />

            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column (Sidebar) - Profile Summary */}
                    <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-6">
                        <Card className="bg-card border border-border rounded-3xl shadow-lg p-6">
                            <div className="text-center space-y-4">
                                <Avatar className="w-32 h-32 mx-auto ring-4 ring-background shadow-md">
                                    <AvatarImage src={provider.avatar || provider.profilePicture} alt={provider.fullName || provider.name} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-3xl font-semibold">
                                        {getInitials(provider.fullName || provider.name || 'Provider')}
                                    </AvatarFallback>
                                </Avatar>
                                
                                <div className="space-y-2">
                                    <h1 className="text-2xl font-bold text-foreground">
                                        {provider.fullName || provider.name}
                                    </h1>
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        <span>{provider.location}</span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap justify-center gap-2">
                                    {provider.services?.slice(0, 5).map((service, index) => (
                                        <Badge 
                                            key={index} 
                                            className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 text-xs font-medium border-none"
                                        >
                                            {service}
                                        </Badge>
                                    ))}
                                </div>

                                {provider.isVerified && (
                                    <Badge className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 border-none mt-4">
                                        <CheckCircle className="w-4 h-4 mr-1.5" />
                                        Verified Provider
                                    </Badge>
                                )}

                                {/* Desktop Actions */}
                                <div className="pt-6">
                                    <Button 
                                        variant="outline" 
                                        onClick={handleMessage}
                                        className="w-full rounded-xl 
                                        border-teal-600 text-teal-600 hover:bg-teal-50"
                                    >
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Message via WhatsApp
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Desktop Pricing Panel */}
                        <div className="hidden lg:block">
                            <Card className="rounded-3xl border border-border shadow-md p-6">
                                <PricingSection provider={provider} />
                            </Card>
                        </div>
                    </div>

                    {/* Right Column (Main Content) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Stats Grid */}
                        <StatsGrid provider={provider} />

                        {/* About */}
                        <Card className="rounded-3xl border border-border shadow-sm p-6">
                            <AboutSection provider={provider} />
                        </Card>

                        {/* Services */}
                        <Card className="rounded-3xl border border-border shadow-sm p-6">
                            <ServicesSection services={provider.services} />
                        </Card>

                        {/* Portfolio */}
                        <Card className="rounded-3xl border border-border shadow-sm p-6">
                            <PortfolioSection portfolio={provider.portfolio} />
                        </Card>

                        {/* Reviews */}
                        <Card className="rounded-3xl border border-border shadow-sm p-6">
                            <ReviewsSection provider={provider} />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ===== Sub-Components =====

const ProfileHeader = () => (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-center">
            <h2 className="text-base font-semibold text-foreground truncate max-w-[180px]">
                Provider Profile
            </h2>
        </div>
    </div>
);

const StatsGrid = ({ provider }) => {
    const stats = [
        {
            icon: Award,
            label: 'Jobs Done',
            value: (provider.reviewsCount || provider.reviewCount) ? `${(provider.reviewsCount || provider.reviewCount) * 5}+` : '0',
        },
        {
            icon: Clock,
            label: 'Response',
            value: '< 30min',
        },
        {
            icon: Star,
            label: 'Rating',
            value: provider.rating ? Number(provider.rating).toFixed(1) : 'N/A',
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, index) => (
                <Card key={index} className="rounded-2xl border border-border/60 shadow-sm bg-card">
                    <CardContent className="p-3 text-center space-y-1">
                        <stat.icon className="w-5 h-5 mx-auto text-primary" />
                        <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                            {stat.label}
                        </p>
                        <p className="text-sm font-bold text-foreground">
                            {stat.value}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

const PricingSection = ({ provider }) => (
    <div className="space-y-3">
        <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Pricing</h3>
        </div>
        {provider.hourlyRate && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Hourly Rate</p>
                <p className="text-2xl font-bold text-primary">
                    {formatCurrency(provider.hourlyRate)}<span className="text-base">/hr</span>
                </p>
            </div>
        )}
        <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="rounded-full text-xs">Cash</Badge>
            <Badge variant="outline" className="rounded-full text-xs">Bank Transfer</Badge>
            <Badge variant="outline" className="rounded-full text-xs">OMT</Badge>
        </div>
    </div>
);

const AboutSection = ({ provider }) => (
    <div className="space-y-2">
        <h3 className="text-base font-semibold text-foreground">About</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
            {provider.bio || 'No bio available'}
        </p>
        <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span>
                    Member since {new Date(provider.createdAt || provider.joinDate || '2024-01-01').toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                    })}
                </span>
            </div>
        </div>
    </div>
);

const ServicesSection = ({ services }) => {
    if (!services || services.length === 0) return null;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">Services Offered</h3>
                {services.length > 3 && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="link" className="text-primary hover:text-primary/80 text-xs p-0 h-auto">
                                See All ({services.length})
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm rounded-3xl">
                            <DialogHeader>
                                <DialogTitle>All Services</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-2 mt-4">
                                {services.map((service, index) => (
                                    <div 
                                        key={index} 
                                        className="flex items-center gap-2 p-3 bg-muted/50 rounded-2xl"
                                    >
                                        <CheckCircle className="w-4 h-4 text-primary" />
                                        <span className="text-sm">{service}</span>
                                    </div>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {services.slice(0, 3).map((service, index) => (
                    <Card 
                        key={index} 
                        className="flex-shrink-0 rounded-2xl border border-border/60 shadow-sm bg-card"
                    >
                        <CardContent className="p-3 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium whitespace-nowrap">{service}</span>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const PortfolioSection = ({ portfolio }) => {
    if (!portfolio || portfolio.length === 0) {
        return (
            <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Portfolio</h3>
                <p className="text-sm text-muted-foreground italic text-center py-6">
                    No portfolio items yet
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">Portfolio</h3>
            <div className="grid grid-cols-2 gap-3">
                {portfolio.slice(0, 4).map((photo, index) => (
                    <Dialog key={index}>
                        <DialogTrigger asChild>
                            <div className="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity shadow-sm border border-border/50">
                                <img 
                                    src={photo} 
                                    alt={`Portfolio ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl p-0 bg-black/95 border-none">
                            <div className="flex items-center justify-center p-4">
                                <img 
                                    src={photo} 
                                    alt={`Portfolio ${index + 1}`}
                                    className="max-w-full max-h-[80vh] object-contain rounded-2xl"
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                ))}
            </div>
        </div>
    );
};

const ReviewsSection = ({ provider }) => {
    // Mock reviews for demonstration
    const mockReviews = [
        {
            name: 'John Customer',
            rating: 5,
            date: '2 weeks ago',
            text: 'Excellent service! Very professional and completed the job on time.'
        },
        {
            name: 'Lisa Johnson',
            rating: 4,
            date: '1 month ago',
            text: 'Good work overall. Would recommend for similar projects.'
        }
    ];

    const reviewCount = provider.reviewsCount || provider.reviewCount || 0;
    const reviews = reviewCount > 0 ? mockReviews : [];

    return (
        <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
                Customer Reviews ({reviewCount})
            </h3>
            
            {reviews.length > 0 ? (
                <div className="space-y-3">
                    {reviews.map((review, index) => (
                        <Card key={index} className="border border-border/50 bg-muted/20 shadow-sm">
                            <CardContent className="p-4 space-y-2">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-8 h-8">
                                            <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">
                                                {review.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{review.name}</p>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i}
                                                        className={`w-3 h-3 ${
                                                            i < review.rating 
                                                                ? 'fill-yellow-400 text-yellow-400' 
                                                                : 'text-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{review.date}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{review.text}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground italic text-center py-6">
                    No reviews yet
                </p>
            )}
        </div>
    );
};

const BottomCtaBar = ({ hourlyRate, onMessage }) => (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-md border-t border-border/50 p-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-3">
            <div className="hidden sm:block flex-1">
                <p className="text-xs text-muted-foreground">From</p>
                <p className="text-lg font-bold text-foreground">
                    {hourlyRate ? formatCurrency(hourlyRate) : 'N/A'}<span className="text-sm">/hr</span>
                </p>
            </div>
            <div className="flex-1 flex gap-2">
                <Button 
                    variant="outline" 
                    onClick={onMessage}
                    className="flex-1 rounded-full border-teal-600 text-teal-600 hover:bg-teal-50"
                >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message via WhatsApp
                </Button>
            </div>
        </div>
    </div>
);

const LoadingState = () => (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-background pb-32">
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 h-14" />
        
        <div className="max-w-md mx-auto px-4 pt-6">
            <Card className="rounded-3xl shadow-lg border overflow-hidden">
                <CardContent className="p-6 space-y-6">
                    <div className="text-center space-y-4">
                        <Skeleton className="w-24 h-24 rounded-full mx-auto" />
                        <Skeleton className="h-6 w-48 mx-auto" />
                        <div className="flex justify-center gap-2">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-3 gap-3">
                        <Skeleton className="h-20 rounded-lg" />
                        <Skeleton className="h-20 rounded-lg" />
                        <Skeleton className="h-20 rounded-lg" />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
);

const ErrorState = ({ error, onRetry, navigate }) => (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-background flex items-center justify-center p-4">
        <Card className="max-w-sm w-full rounded-3xl shadow-lg">
            <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                    <span className="text-3xl">⚠️</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                    Unable to Load Provider
                </h2>
                <p className="text-sm text-muted-foreground">
                    {error || 'Provider not found'}
                </p>
                <div className="flex gap-2 pt-2">
                    <Button 
                        variant="outline" 
                        onClick={() => navigate(-1)}
                        className="flex-1 rounded-full"
                    >
                        Go Back
                    </Button>
                    <Button 
                        onClick={onRetry}
                        className="flex-1 rounded-full bg-teal-600 hover:bg-teal-700"
                    >
                        Try Again
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
);
