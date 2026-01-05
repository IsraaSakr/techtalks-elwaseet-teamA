import { Badge } from '../ui/badge';
import { STATUS_COLORS, JOB_STATUS, APPLICATION_STATUS } from '../../lib/constants';
import { cn } from '../../lib/utils';

export const StatusBadge = ({ status, type = 'job' }) => {
    const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';

    // Format status text
    const formatStatus = (status) => {
        if (!status) return 'Unknown';
        return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <Badge className={cn('font-medium', colorClass)} variant="secondary">
            {formatStatus(status)}
        </Badge>
    );
};
