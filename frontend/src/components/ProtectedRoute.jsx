import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FullPageLoader } from './shared/LoadingSpinner';
import { ROUTES } from '../lib/constants';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, loading, user, hasRole } = useAuth();

    if (loading) {
        return <FullPageLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    // Check if user has required role
    if (allowedRoles.length > 0) {
        const hasPermission = allowedRoles.some(role => hasRole(role));

        if (!hasPermission) {
            // Redirect to appropriate dashboard based on user role
            if (user.role === 'admin') {
                return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
            } else if (user.role === 'provider' || user.role === 'hybrid') {
                return <Navigate to={ROUTES.PROVIDER_DASHBOARD} replace />;
            } else {
                return <Navigate to={ROUTES.CUSTOMER_DASHBOARD} replace />;
            }
        }
    }

    return children;
};
