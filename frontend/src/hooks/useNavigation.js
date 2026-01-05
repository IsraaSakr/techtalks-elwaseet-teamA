import { useAuth } from './useAuth';
import { ROUTES } from '../lib/constants';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    PlusCircle,
    FileText,
    Settings,
    AlertCircle,
    DollarSign,
    UserCircle,
} from 'lucide-react';

export const useNavigation = () => {
    const { isCustomer, isProvider, isAdmin } = useAuth();

    const customerNavItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.CUSTOMER_DASHBOARD },
        { icon: PlusCircle, label: 'Post Job', path: ROUTES.POST_JOB },
        { icon: Users, label: 'Browse Providers', path: ROUTES.BROWSE_PROVIDERS },
        { icon: DollarSign, label: 'Transactions', path: ROUTES.TRANSACTIONS },
    ];

    const providerNavItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.PROVIDER_DASHBOARD },
        { icon: Briefcase, label: 'Browse Jobs', path: ROUTES.BROWSE_JOBS },
        { icon: FileText, label: 'My Applications', path: ROUTES.MY_APPLICATIONS },
        { icon: UserCircle, label: 'Edit Profile', path: ROUTES.EDIT_PROFILE },
        { icon: DollarSign, label: 'Transactions', path: ROUTES.TRANSACTIONS },
    ];

    const adminNavItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD },
        { icon: AlertCircle, label: 'Disputes', path: ROUTES.ADMIN_DISPUTES },
    ];

    let navItems = [];
    if (isAdmin()) {
        navItems = adminNavItems;
    } else if (isProvider()) {
        navItems = providerNavItems;
    } else if (isCustomer()) {
        navItems = customerNavItems;
    }

    return { navItems };
};
