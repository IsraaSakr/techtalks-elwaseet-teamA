import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const variants = {
    error: {
        icon: AlertCircle,
        className: 'border-red-200 bg-red-50 text-red-900',
    },
    success: {
        icon: CheckCircle,
        className: 'border-green-200 bg-green-50 text-green-900',
    },
    warning: {
        icon: AlertTriangle,
        className: 'border-yellow-200 bg-yellow-50 text-yellow-900',
    },
    info: {
        icon: Info,
        className: 'border-blue-200 bg-blue-50 text-blue-900',
    },
};

export const ErrorMessage = ({ title, message, variant = 'error', onRetry }) => {
    const { icon: Icon, className } = variants[variant];

    return (
        <Alert className={className}>
            <Icon className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription className="mt-2">
                {message}
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="ml-2 underline font-medium hover:no-underline"
                    >
                        Try again
                    </button>
                )}
            </AlertDescription>
        </Alert>
    );
};
