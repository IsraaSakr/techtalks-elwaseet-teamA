import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const LoadingSpinner = ({ size = 'default', className }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        default: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className={cn('flex items-center justify-center', className)}>
            <Loader2 className={cn('animate-spin text-blue-600', sizeClasses[size])} />
        </div>
    );
};

export const FullPageLoader = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Loading...</p>
            </div>
        </div>
    );
};
