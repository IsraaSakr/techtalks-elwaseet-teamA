import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
    MapPin, 
    DollarSign, 
    Calendar, 
    User, 
    CheckCircle, 
    XCircle,
    Edit,
    Trash2,
    Clock,
    AlertTriangle,
    Star,
    X,
    ChevronLeft,
    ChevronRight,
    Zap,
    Phone,
    Mail,
    MessageSquare,
    ArrowRight,
    BadgeCheck,
    ChevronDown,
    ChevronUp,
    SortAsc,
    Image as ImageIcon
} from 'lucide-react';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { jobsAPI, applicationsAPI } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import { ROUTES, USER_ROLES, JOB_STATUS } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import ScrollReveal from '../../components/ui/ScrollReveal';

/**
 * Urgency level styling
 */
const URGENCY_STYLES = {
    LOW: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    MEDIUM: 'bg-amber-100 text-amber-700 border-amber-300',
    HIGH: 'bg-rose-100 text-rose-700 border-rose-300'
};

/**
 * Format relative time
 */
const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return formatDate(dateString);
};

/**
 * Photo Lightbox Component
 */
const PhotoLightbox = ({ photos, currentIndex, onClose, onNext, onPrev }) => {
    if (currentIndex === null || !photos || photos.length === 0) return null;

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        };
        
        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [onClose, onNext, onPrev]);

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Previous button */}
            {photos.length > 1 && (
                <button
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-4 text-white/80 hover:text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
            )}

            {/* Image */}
            <img
                src={photos[currentIndex]}
                alt={`Photo ${currentIndex + 1}`}
                className="max-h-[90vh] max-w-[90vw] object-contain"
                onClick={(e) => e.stopPropagation()}
            />

            {/* Next button */}
            {photos.length > 1 && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="absolute right-4 text-white/80 hover:text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 bg-black/50 px-4 py-2 rounded-full">
                {currentIndex + 1} / {photos.length}
            </div>
        </div>
    );
};

/**
 * Photo Gallery Component
 */
const PhotoGallery = ({ photos }) => {
    const [lightboxIndex, setLightboxIndex] = useState(null);

    if (!photos || photos.length === 0) return null;

    const handleNext = () => {
        setLightboxIndex((prev) => (prev + 1) % photos.length);
    };

    const handlePrev = () => {
        setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    return (
        <>
            <div className="pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Photos ({photos.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {photos.map((photo, index) => (
                        <button
                            key={index}
                            onClick={() => setLightboxIndex(index)}
                            className="relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors group"
                        >
                            <img
                                src={photo}
                                alt={`Job photo ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                                    View
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <PhotoLightbox
                photos={photos}
                currentIndex={lightboxIndex}
                onClose={() => setLightboxIndex(null)}
                onNext={handleNext}
                onPrev={handlePrev}
            />
        </>
    );
};

/**
 * Transaction Timeline Component
 */
const TransactionTimeline = ({ job, transaction }) => {
    const status = job?.status;
    
    // Define timeline steps
    const steps = [
        {
            id: 'accepted',
            label: 'Application Accepted',
            description: transaction?.acceptedAt ? formatRelativeTime(transaction.acceptedAt) : 'Provider was accepted',
            completed: ['IN_PROGRESS', 'COMPLETED', 'CONFIRMED', 'DISPUTED'].includes(status),
            current: status === 'IN_PROGRESS' && !transaction?.startedAt
        },
        {
            id: 'started',
            label: 'Work Started',
            description: transaction?.startedAt ? formatRelativeTime(transaction.startedAt) : 'Provider begins work',
            completed: ['COMPLETED', 'CONFIRMED', 'DISPUTED'].includes(status) || transaction?.startedAt,
            current: status === 'IN_PROGRESS' && transaction?.startedAt
        },
        {
            id: 'completed',
            label: 'Work Completed',
            description: transaction?.completedAt ? formatRelativeTime(transaction.completedAt) : 'Provider marks job complete',
            completed: ['CONFIRMED'].includes(status),
            current: status === 'COMPLETED'
        },
        {
            id: 'confirmed',
            label: 'Payment Confirmed',
            description: transaction?.confirmedAt ? formatRelativeTime(transaction.confirmedAt) : 'Customer confirms & pays',
            completed: status === 'CONFIRMED',
            current: false
        }
    ];

    return (
        <div className="space-y-4">
            {steps.map((step, index) => (
                <div key={step.id} className="flex gap-4">
                    {/* Icon */}
                    <div className="flex flex-col items-center">
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center border-2
                            ${step.completed 
                                ? 'bg-green-100 border-green-500 text-green-600' 
                                : step.current
                                    ? 'bg-blue-100 border-blue-500 text-blue-600 animate-pulse'
                                    : 'bg-gray-100 border-gray-300 text-gray-400'
                            }
                        `}>
                            {step.completed ? (
                                <CheckCircle className="w-4 h-4" />
                            ) : step.current ? (
                                <Clock className="w-4 h-4" />
                            ) : (
                                <span className="text-xs font-semibold">{index + 1}</span>
                            )}
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`w-0.5 h-8 ${step.completed ? 'bg-green-300' : 'bg-gray-200'}`} />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                        <p className={`font-medium ${step.completed || step.current ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.label}
                        </p>
                        <p className={`text-sm ${step.completed || step.current ? 'text-gray-600' : 'text-gray-400'}`}>
                            {step.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

/**
 * Provider Info Card Component
 */
const ProviderInfoCard = ({ provider, transaction }) => {
    if (!provider) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Assigned Provider</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                        {provider.avatar ? (
                            <AvatarImage src={provider.avatar} alt={provider.name} />
                        ) : (
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                                {provider.name?.charAt(0) || <User className="w-6 h-6" />}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{provider.name || `Provider #${provider.id}`}</h4>
                        {provider.rating && (
                            <div className="flex items-center gap-1 mt-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-sm text-gray-600">{provider.rating.toFixed(1)}</span>
                                {provider.reviewCount && (
                                    <span className="text-sm text-gray-400">({provider.reviewCount} reviews)</span>
                                )}
                            </div>
                        )}
                        {transaction?.quote && (
                            <div className="mt-2">
                                <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                                    <DollarSign className="w-3 h-3 mr-1" />
                                    Agreed Price: {formatCurrency(transaction.quote)}
                                </Badge>
                            </div>
                        )}
                    </div>
                    <Link to={ROUTES.PROVIDER_PROFILE?.(provider.id) || `/providers/${provider.id}`}>
                        <Button variant="outline" size="sm">
                            View Profile
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};

/**
 * Delete Confirmation Modal
 */
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Delete Job</h3>
                        <p className="text-sm text-gray-500">This action cannot be undone</p>
                    </div>
                </div>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this job? All applications will also be removed.
                </p>
                <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={onConfirm} 
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {loading ? 'Deleting...' : 'Delete Job'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

/**
 * Accept Application Confirmation Modal
 */
const AcceptConfirmModal = ({ isOpen, onClose, onConfirm, application, loading }) => {
    if (!isOpen || !application) return null;

    const providerName = application.providerName || `Provider #${application.providerId}`;
    const quoteAmount = formatCurrency(application.quote);

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Accept Application</h3>
                        <p className="text-sm text-gray-500">Confirm your selection</p>
                    </div>
                </div>

                {/* Provider Info Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                            {application.providerPhoto || application.providerAvatar ? (
                                <AvatarImage 
                                    src={application.providerPhoto || application.providerAvatar} 
                                    alt={providerName} 
                                />
                            ) : (
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                    {providerName.charAt(0)}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div>
                            <p className="font-semibold text-gray-900">{providerName}</p>
                            {(application.providerRating || application.rating) && (
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm text-gray-600">
                                        {(application.providerRating || application.rating).toFixed(1)}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-sm text-gray-500">Quote</p>
                            <p className="text-xl font-bold text-green-600">{quoteAmount}</p>
                        </div>
                    </div>
                </div>

                {/* What happens */}
                <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">This will:</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Accept <strong>{providerName}</strong>'s application</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span>Reject all other pending applications</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <DollarSign className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>Create an escrow transaction for {quoteAmount}</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Mail className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span>Notify {providerName} to start work</span>
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={onConfirm} 
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                Accepting...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Accept Application
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

/**
 * Application Card Component - Enhanced version
 * Shows provider info, quote, message, photos, and actions
 */
const ApplicationCard = ({ 
    application, 
    job, 
    onAccept, 
    onReject, 
    isLowestQuote,
    isHighestRated,
    onViewPhotos 
}) => {
    const navigate = useNavigate();
    const [isMessageExpanded, setIsMessageExpanded] = useState(false);
    
    // Check if message is long (more than 150 characters)
    const isMessageLong = application.message && application.message.length > 150;
    const displayMessage = isMessageExpanded || !isMessageLong 
        ? application.message 
        : `${application.message.slice(0, 150)}...`;

    // Format the quote prominently
    const formattedQuote = formatCurrency(application.quote);

    return (
        <div className={`
            border rounded-xl p-5 transition-all bg-white shadow-sm
            ${application.status === 'ACCEPTED' 
                ? 'border-green-300 bg-green-50/50 ring-2 ring-green-200' 
                : application.status === 'REJECTED'
                    ? 'border-gray-200 bg-gray-50/50 opacity-60'
                    : 'hover:border-blue-300 hover:shadow-md'
            }
        `}>
            <div className="flex flex-col gap-4">
                {/* Top Row: Provider Info + Quote */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Provider Info */}
                    <div className="flex items-start gap-4">
                        <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                            {application.providerPhoto || application.providerAvatar ? (
                                <AvatarImage 
                                    src={application.providerPhoto || application.providerAvatar} 
                                    alt={application.providerName} 
                                />
                            ) : (
                                <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                                    {application.providerName?.charAt(0) || <User className="w-6 h-6" />}
                                </AvatarFallback>
                            )}
                        </Avatar>

                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <button
                                    onClick={() => navigate(ROUTES.PROVIDER_PROFILE?.(application.providerId) || `/providers/${application.providerId}`)}
                                    className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-lg"
                                >
                                    {application.providerName || `Provider #${application.providerId}`}
                                </button>
                                {(application.providerVerified || application.verified) && (
                                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 gap-1">
                                        <BadgeCheck className="w-3.5 h-3.5" />
                                        Verified
                                    </Badge>
                                )}
                            </div>
                            
                            {/* Rating and Reviews */}
                            <div className="flex items-center gap-3 mt-1">
                                {(application.providerRating || application.rating) && (
                                    <div className="flex items-center gap-1">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${
                                                        star <= Math.round(application.providerRating || application.rating)
                                                            ? 'text-yellow-500 fill-yellow-500'
                                                            : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 ml-1">
                                            {(application.providerRating || application.rating).toFixed(1)}
                                        </span>
                                    </div>
                                )}
                                {(application.providerReviews || application.reviewCount) && (
                                    <span className="text-sm text-gray-500">
                                        ({application.providerReviews || application.reviewCount} reviews)
                                    </span>
                                )}
                            </div>

                            {/* Applied date */}
                            <p className="text-xs text-gray-400 mt-1">
                                Applied {formatRelativeTime(application.appliedAt || application.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Quote - Prominent Display */}
                    <div className="flex flex-col items-end gap-2">
                        <div className={`
                            px-4 py-2 rounded-lg border-2 text-center min-w-[120px]
                            ${isLowestQuote 
                                ? 'bg-green-50 border-green-400 text-green-700' 
                                : 'bg-gray-50 border-gray-200 text-gray-700'
                            }
                        `}>
                            <p className="text-xs uppercase tracking-wide mb-0.5">
                                {isLowestQuote ? '★ Lowest Quote' : 'Quote'}
                            </p>
                            <p className="text-2xl font-bold">{formattedQuote}</p>
                        </div>
                        
                        {/* Status Badge */}
                        {application.status === 'PENDING' && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                            </Badge>
                        )}
                        {application.status === 'ACCEPTED' && (
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Accepted
                            </Badge>
                        )}
                        {application.status === 'REJECTED' && (
                            <Badge className="bg-red-100 text-red-800 border-red-300">
                                <XCircle className="w-3 h-3 mr-1" />
                                Rejected
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Message Section */}
                {application.message && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                    {displayMessage}
                                </p>
                                {isMessageLong && (
                                    <button
                                        onClick={() => setIsMessageExpanded(!isMessageExpanded)}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1 flex items-center gap-1"
                                    >
                                        {isMessageExpanded ? (
                                            <>Show less <ChevronUp className="w-4 h-4" /></>
                                        ) : (
                                            <>Read more <ChevronDown className="w-4 h-4" /></>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Details Row: Proposed Date + Photos */}
                <div className="flex flex-wrap items-center gap-4">
                    {(application.proposedDate || application.proposedStartDate) && (
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                                Can start: <span className="font-medium text-gray-900">
                                    {formatDate(application.proposedDate || application.proposedStartDate)}
                                </span>
                            </span>
                        </div>
                    )}
                    {application.availability && (
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{application.availability}</span>
                        </div>
                    )}
                </div>

                {/* Application Photos */}
                {application.photos && application.photos.length > 0 && (
                    <div>
                        <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                            <ImageIcon className="w-4 h-4" />
                            Work samples ({application.photos.length})
                        </p>
                        <div className="flex gap-2">
                            {application.photos.slice(0, 3).map((photo, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onViewPhotos?.(application.photos, idx)}
                                    className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors group"
                                >
                                    <img
                                        src={photo}
                                        alt={`Work sample ${idx + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                </button>
                            ))}
                            {application.photos.length > 3 && (
                                <button
                                    onClick={() => onViewPhotos?.(application.photos, 0)}
                                    className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                                >
                                    <span className="text-sm font-medium">+{application.photos.length - 3}</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                {application.status === 'PENDING' && job?.status === 'OPEN' && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(ROUTES.PROVIDER_PROFILE?.(application.providerId) || `/providers/${application.providerId}`)}
                        >
                            <User className="w-4 h-4 mr-1" />
                            View Profile
                        </Button>
                        <div className="flex-1" />
                        <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={onReject}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                        </Button>
                        <Button
                            size="sm"
                            onClick={onAccept}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept Application
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * Job Details Page Component
 */
export const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // Data state
    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // UI state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Accept application modal state
    const [acceptModalOpen, setAcceptModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [acceptLoading, setAcceptLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    // Application sorting state
    const [sortBy, setSortBy] = useState('quote'); // 'quote', 'rating', 'date'
    
    // Application photos lightbox state
    const [appPhotosLightbox, setAppPhotosLightbox] = useState({ photos: [], index: null });

    /**
     * Fetch job details
     */
    const fetchJobDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const jobResponse = await jobsAPI.getById(id);
            const jobData = jobResponse.data?.job || jobResponse.data || jobResponse.job || jobResponse;
            setJob(jobData);

            // Only fetch applications if job is OPEN
            if (jobData.status === 'OPEN' || jobData.status === JOB_STATUS?.OPEN) {
                try {
                    const appsResponse = await applicationsAPI.getByJob(id);
                    const appsData = appsResponse.data?.applications || appsResponse.applications || appsResponse.data || [];
                    setApplications(Array.isArray(appsData) ? appsData : []);
                } catch (appErr) {
                    console.error('Failed to load applications:', appErr);
                    setApplications([]);
                }
            }
        } catch (err) {
            console.error('Error fetching job details:', err);
            if (err.response?.status === 404) {
                setError('Job not found');
            } else {
                setError('Failed to load job details');
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchJobDetails();
    }, [fetchJobDetails]);

    /**
     * Handle accept button click - shows confirmation modal
     */
    const handleAcceptClick = (application) => {
        // Find the full application object if only providerId was passed
        const fullApplication = applications.find(
            app => (app.providerId === application || app.id === application || 
                   app.providerId === application.providerId || app.id === application.id)
        ) || application;
        
        setSelectedApplication(fullApplication);
        setAcceptModalOpen(true);
    };

    /**
     * Handle confirm accept - actually accepts the application
     */
    const handleConfirmAccept = async () => {
        if (!selectedApplication) return;
        
        const providerId = selectedApplication.providerId || selectedApplication.id;
        const providerName = selectedApplication.providerName || `Provider #${providerId}`;
        
        try {
            setAcceptLoading(true);
            await applicationsAPI.accept(id, providerId);
            
            // Show success message
            setSuccessMessage(`Application accepted! ${providerName} has been notified and will start work soon.`);
            
            // Close modal
            setAcceptModalOpen(false);
            setSelectedApplication(null);
            
            // Refresh data to show updated statuses
            fetchJobDetails();
            
            // Clear success message after 5 seconds
            setTimeout(() => setSuccessMessage(''), 5000);
            
        } catch (err) {
            console.error('Error accepting application:', err);
            
            // Handle specific errors
            if (err.response?.status === 404) {
                alert('Application or job not found. Please refresh the page.');
            } else if (err.response?.status === 409) {
                alert('This job is no longer open. Another application may have been accepted.');
                fetchJobDetails(); // Refresh to show current state
            } else {
                alert('Failed to accept application. Please try again.');
            }
        } finally {
            setAcceptLoading(false);
        }
    };

    /**
     * Handle reject application
     */
    const handleRejectApplication = async (applicationId) => {
        try {
            setActionLoading(true);
            await applicationsAPI.reject?.(applicationId);
            fetchJobDetails();
        } catch (err) {
            console.error('Error rejecting application:', err);
        } finally {
            setActionLoading(false);
        }
    };

    /**
     * Handle delete job
     */
    const handleDeleteJob = async () => {
        try {
            setDeleteLoading(true);
            await jobsAPI.delete(id);
            navigate(ROUTES.CUSTOMER_DASHBOARD);
        } catch (err) {
            console.error('Error deleting job:', err);
            alert('Failed to delete job. Please try again.');
        } finally {
            setDeleteLoading(false);
            setDeleteModalOpen(false);
        }
    };

    /**
     * Get the lowest quote from applications
     */
    const getLowestQuote = () => {
        if (applications.length === 0) return null;
        return Math.min(...applications.map(app => app.quote || Infinity));
    };

    /**
     * Get the highest rating from applications
     */
    const getHighestRating = () => {
        if (applications.length === 0) return null;
        return Math.max(...applications.map(app => app.providerRating || app.rating || 0));
    };

    /**
     * Sort applications based on current sort option
     */
    const sortedApplications = useMemo(() => {
        const sorted = [...applications];
        
        switch (sortBy) {
            case 'quote':
                // Lowest quote first
                sorted.sort((a, b) => (a.quote || 0) - (b.quote || 0));
                break;
            case 'rating':
                // Highest rating first
                sorted.sort((a, b) => 
                    (b.providerRating || b.rating || 0) - (a.providerRating || a.rating || 0)
                );
                break;
            case 'date':
                // Most recent first
                sorted.sort((a, b) => 
                    new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt)
                );
                break;
            default:
                break;
        }
        
        return sorted;
    }, [applications, sortBy]);

    /**
     * Handle viewing application photos in lightbox
     */
    const handleViewAppPhotos = (photos, index) => {
        setAppPhotosLightbox({ photos, index });
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner />
            </div>
        );
    }

    // Error state
    if (error || !job) {
        return (
            <div className="text-center py-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{error || 'Job not found'}</h2>
                <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
                <Button onClick={() => navigate(ROUTES.CUSTOMER_DASHBOARD)}>
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    const isOpen = job.status === 'OPEN' || job.status === JOB_STATUS?.OPEN;
    const isInProgress = job.status === 'IN_PROGRESS' || job.status === JOB_STATUS?.IN_PROGRESS;
    const isCompleted = job.status === 'COMPLETED' || job.status === JOB_STATUS?.COMPLETED;
    const isConfirmed = job.status === 'CONFIRMED' || job.status === JOB_STATUS?.CONFIRMED;
    const isDisputed = job.status === 'DISPUTED' || job.status === JOB_STATUS?.DISPUTED;
    const lowestQuote = getLowestQuote();

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-8">
            {/* Success Message */}
            {successMessage && (
                <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                        {successMessage}
                    </AlertDescription>
                </Alert>
            )}

            {/* Header */}
            <ScrollReveal>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <StatusBadge status={job.status} type="job" />
                            {job.urgency && (
                                <Badge className={`${URGENCY_STYLES[job.urgency]} border`}>
                                    <Zap className="w-3 h-3 mr-1" />
                                    {job.urgency} Urgency
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{job.title}</h1>
                        <p className="text-gray-500 mt-1">
                            Posted {formatRelativeTime(job.postedAt || job.createdAt)}
                            {job.categoryName && ` • ${job.categoryName}`}
                        </p>
                    </div>

                    {/* Action Buttons - Only show for OPEN status */}
                    {isOpen && user?.role !== USER_ROLES.ADMIN && (
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                onClick={() => navigate(ROUTES.CUSTOMER_EDIT_JOB?.(id) || `/customer/jobs/${id}/edit`)}
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Job
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={() => setDeleteModalOpen(true)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
            </ScrollReveal>

            {/* Job Information Card */}
            <ScrollReveal delay={0.1}>
                <Card>
                    <CardHeader>
                        <CardTitle>Job Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Description */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Category</p>
                                <Badge variant="secondary" className="px-3 py-1">
                                    {job.categoryName || job.category || 'General'}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Location</p>
                                <div className="flex items-center gap-1 text-gray-900">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span>{job.location?.replace('_', ' ')}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Budget Range</p>
                                <div className="flex items-center gap-1 text-gray-900 font-semibold">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    <span>{formatCurrency(job.budgetMin)} - {formatCurrency(job.budgetMax)}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">Posted</p>
                                <div className="flex items-center gap-1 text-gray-900">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span>{formatDate(job.postedAt || job.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Photo Gallery */}
                        <PhotoGallery photos={job.photos} />
                    </CardContent>
                </Card>
            </ScrollReveal>

            {/* Provider Info - Show when job has an assigned provider */}
            {!isOpen && (job.provider || job.transaction?.provider) && (
                <ScrollReveal delay={0.15}>
                    <ProviderInfoCard 
                        provider={job.provider || job.transaction?.provider} 
                        transaction={job.transaction}
                    />
                </ScrollReveal>
            )}

            {/* Transaction Timeline - Show for non-OPEN statuses */}
            {!isOpen && (
                <ScrollReveal delay={0.2}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaction Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TransactionTimeline job={job} transaction={job.transaction} />
                        </CardContent>
                    </Card>
                </ScrollReveal>
            )}

            {/* Applications Section - Only show for OPEN jobs */}
            {isOpen && (
                <ScrollReveal delay={0.2}>
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <CardTitle>Applications Received ({applications.length})</CardTitle>
                                
                                {/* Sort Dropdown - Only show if there are applications */}
                                {applications.length > 1 && (
                                    <div className="flex items-center gap-2">
                                        <SortAsc className="w-4 h-4 text-gray-400" />
                                        <Select value={sortBy} onValueChange={setSortBy}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Sort by..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="quote">Lowest Quote First</SelectItem>
                                                <SelectItem value="rating">Highest Rated First</SelectItem>
                                                <SelectItem value="date">Most Recent First</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {applications.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-600 font-medium">No applications yet</p>
                                    <p className="text-gray-500 text-sm mt-1">Providers will apply soon!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {sortedApplications.map((app) => (
                                        <ApplicationCard
                                            key={app.applicationId || app.id}
                                            application={app}
                                            job={job}
                                            onAccept={() => handleAcceptClick(app)}
                                            onReject={() => handleRejectApplication(app.applicationId || app.id)}
                                            isLowestQuote={app.quote === lowestQuote}
                                            isHighestRated={(app.providerRating || app.rating) === getHighestRating()}
                                            onViewPhotos={handleViewAppPhotos}
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </ScrollReveal>
            )}

            {/* Application Photos Lightbox */}
            {appPhotosLightbox.index !== null && (
                <PhotoLightbox
                    photos={appPhotosLightbox.photos}
                    currentIndex={appPhotosLightbox.index}
                    onClose={() => setAppPhotosLightbox({ photos: [], index: null })}
                    onNext={() => setAppPhotosLightbox(prev => ({
                        ...prev,
                        index: (prev.index + 1) % prev.photos.length
                    }))}
                    onPrev={() => setAppPhotosLightbox(prev => ({
                        ...prev,
                        index: (prev.index - 1 + prev.photos.length) % prev.photos.length
                    }))}
                />
            )}

            {/* Action Card for COMPLETED status */}
            {isCompleted && user?.role !== USER_ROLES.ADMIN && (
                <ScrollReveal delay={0.25}>
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Job Marked as Completed
                                    </h3>
                                    <p className="text-sm text-blue-700 mt-1">
                                        The provider has marked this job as completed. Please review and confirm to release payment.
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline"
                                        onClick={() => navigate(ROUTES.CUSTOMER_JOB_DISPUTE?.(id) || `/customer/jobs/${id}/dispute`)}
                                        className="border-red-300 text-red-600 hover:bg-red-50"
                                    >
                                        <AlertTriangle className="w-4 h-4 mr-2" />
                                        Report Issue
                                    </Button>
                                    <Button 
                                        onClick={() => navigate(ROUTES.CUSTOMER_RATE_PROVIDER?.(id) || `/customer/jobs/${id}/rate`)}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Confirm & Pay
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </ScrollReveal>
            )}

            {/* Waiting message for IN_PROGRESS */}
            {isInProgress && (
                <ScrollReveal delay={0.25}>
                    <Alert className="bg-purple-50 border-purple-200">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <AlertDescription className="text-purple-700">
                            <strong>Work in Progress</strong> - The provider is currently working on your job. 
                            You'll be notified when they mark it as complete.
                        </AlertDescription>
                    </Alert>
                </ScrollReveal>
            )}

            {/* Back Button */}
            <ScrollReveal delay={0.3}>
                <div className="flex gap-4 pt-4">
                    <Button 
                        variant="outline" 
                        onClick={() => navigate(user?.role === USER_ROLES.ADMIN ? ROUTES.ADMIN_DASHBOARD : ROUTES.CUSTOMER_DASHBOARD)}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </div>
            </ScrollReveal>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteJob}
                loading={deleteLoading}
            />

            {/* Accept Application Confirmation Modal */}
            <AcceptConfirmModal
                isOpen={acceptModalOpen}
                onClose={() => {
                    setAcceptModalOpen(false);
                    setSelectedApplication(null);
                }}
                onConfirm={handleConfirmAccept}
                application={selectedApplication}
                loading={acceptLoading}
            />
        </div>
    );
};