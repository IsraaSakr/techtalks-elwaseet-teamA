import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { MapPin, Star, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProviderCard = ({ provider, showActions = true, onViewProfile }) => {
    const navigate = useNavigate();

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleViewProfile = () => {
        if (onViewProfile) {
            onViewProfile(provider.id);
        }
    };

    return (
        <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
                <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={provider.avatar} alt={provider.fullName} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                            {getInitials(provider.fullName)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-card-foreground mb-1">
                            {provider.fullName}
                        </h3>

                        <div className="flex items-center gap-1 mb-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-foreground">
                                {provider.rating?.toFixed(1) || 'N/A'}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                ({provider.reviewCount || 0} reviews)
                            </span>
                        </div>

                        {provider.isVerified && (
                            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                Verified
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {provider.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {provider.bio}
                    </p>
                )}

                <div className="flex flex-wrap gap-2">
                    {provider.services?.slice(0, 3).map((service, index) => (
                        <Badge key={index} variant="outline">
                            {service}
                        </Badge>
                    ))}
                    {provider.services?.length > 3 && (
                        <Badge variant="outline">
                            +{provider.services.length - 3} more
                        </Badge>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{provider.location}</span>
                    </div>

                    {provider.hourlyRate && (
                        <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            <span>${provider.hourlyRate}/hr</span>
                        </div>
                    )}
                </div>

                {provider.portfolio && provider.portfolio.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto">
                        {provider.portfolio.slice(0, 4).map((photo, index) => (
                            <img
                                key={index}
                                src={photo}
                                alt={`Portfolio ${index + 1}`}
                                className="w-16 h-16 object-cover rounded-md"
                            />
                        ))}
                        {provider.portfolio.length > 4 && (
                            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                                +{provider.portfolio.length - 4}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>

            {showActions && (
                <CardFooter>
                    <Button
                        onClick={handleViewProfile}
                        className="w-full"
                        variant="default"
                    >
                        View Profile
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};
