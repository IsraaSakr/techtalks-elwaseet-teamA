import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
    MapPin, 
    Calendar, 
    DollarSign, 
    Sparkles, 
    Zap, 
    Droplets, 
    Paintbrush, 
    Truck, 
    Hammer, 
    Thermometer, 
    BookOpen, 
    Shovel, 
    Briefcase,
    Wrench,
    ArrowRight
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';
import { StatusBadge } from './StatusBadge';
const getCategoryConfig = (category) => {
    const icons = {
        'Cleaning': Sparkles,
        'Plumbing': Droplets,
        'Electrical': Zap,
        'Painting': Paintbrush,
        'Moving': Truck,
        'Carpentry': Hammer,
        'Handyman': Hammer,
        'Landscaping': Shovel,
        'HVAC': Thermometer,
        'Tutoring': BookOpen,
        'Other': Briefcase
    };

    return {
        icon: icons[category] || icons['Other']
    };
};

const defaultTheme = {
    bg: 'bg-white',
    border: 'border-blue-100',
    text: 'text-blue-900',
    subText: 'text-blue-700/80',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    iconColor: 'text-blue-200',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
};

export const JobCard = ({ job, showActions = true, onViewDetails, className = '' }) => {
    const config = getCategoryConfig(job.category);
    const CategoryIcon = config.icon;
    const theme = defaultTheme;

    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails(job.id);
        }
    };

    return (
        <Card className={`relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg ${theme.bg} ${theme.border} h-80 ${className}`}>
            {/* Background Icon */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-0">
                <CategoryIcon 
                    className={`w-56 h-56 ${theme.iconColor} opacity-20 transform rotate-0`} 
                    strokeWidth={0.5}
                />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <CardContent className="p-5 flex-grow space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                            <Badge variant="outline" className={`${theme.badge} border shadow-sm`}>
                                {job.category}
                            </Badge>
                            <h3 className={`text-xl font-bold ${theme.text} line-clamp-1`}>
                                {job.title}
                            </h3>
                        </div>
                        <StatusBadge status={job.status} type="job" />
                    </div>

                    {/* Description */}
                    <p className={`text-sm ${theme.subText} line-clamp-2 leading-relaxed`}>
                        {job.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm mt-2">
                        <div className={`flex items-center gap-1.5 ${theme.subText}`}>
                            <MapPin className="w-4 h-4" />
                            <span className="font-medium">{job.location}</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${theme.subText}`}>
                            <DollarSign className="w-4 h-4" />
                            <span className="font-medium">
                                {formatCurrency(job.budgetMin)} - {formatCurrency(job.budgetMax)}
                            </span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${theme.subText}`}>
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{formatDate(job.createdAt)}</span>
                        </div>
                    </div>
                </CardContent>

                {showActions && (
                    <CardFooter className="p-4 pt-0">
                        <Button 
                            onClick={handleViewDetails}
                            className={`w-full h-12 whitespace-nowrap font-semibold shadow-sm transition-colors ${theme.button}`}
                            size="lg"
                        >
                            <span>View Details</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </CardFooter>
                )}
            </div>
        </Card>
    );
};
