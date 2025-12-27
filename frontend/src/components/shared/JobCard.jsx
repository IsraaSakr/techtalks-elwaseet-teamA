import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MapPin, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';
import { StatusBadge } from './StatusBadge';
import { useNavigate } from 'react-router-dom';

export const JobCard = ({ job, showActions = true, onViewDetails }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails(job.id);
        }
    };

    return (
        <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-card-foreground mb-1">
                            {job.title}
                        </h3>
                        <Badge variant="outline" className="mb-2">
                            {job.category}
                        </Badge>
                    </div>
                    <StatusBadge status={job.status} type="job" />
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                </p>

                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>
                            {formatCurrency(job.budgetMin)} - {formatCurrency(job.budgetMax)}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(job.createdAt)}</span>
                    </div>
                </div>

                {job.photos && job.photos.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto">
                        {job.photos.slice(0, 3).map((photo, index) => (
                            <img
                                key={index}
                                src={photo}
                                alt={`Job photo ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-md"
                            />
                        ))}
                        {job.photos.length > 3 && (
                            <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">
                                +{job.photos.length - 3}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>

            {showActions && (
                <CardFooter>
                    <Button
                        onClick={handleViewDetails}
                        className="w-full"
                        variant="default"
                    >
                        View Details
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};
