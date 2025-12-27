import { FileQuestion, Inbox, Search, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const icons = {
    inbox: Inbox,
    search: Search,
    question: FileQuestion,
    alert: AlertCircle,
};

export const EmptyState = ({
    icon = 'inbox',
    title,
    description,
    action,
    className
}) => {
    const Icon = icons[icon] || Inbox;

    return (
        <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
            <div className="rounded-full bg-gray-100 p-6 mb-4">
                <Icon className="w-12 h-12 text-gray-400" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
            </h3>

            {description && (
                <p className="text-sm text-gray-500 text-center max-w-md mb-6">
                    {description}
                </p>
            )}

            {action && (
                <div className="mt-4">
                    {action}
                </div>
            )}
        </div>
    );
};
