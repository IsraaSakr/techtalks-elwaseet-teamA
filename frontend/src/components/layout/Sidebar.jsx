import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../lib/constants';
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

export const Sidebar = () => {
    const location = useLocation();
    const { isCustomer, isProvider, isAdmin } = useAuth();

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    // Customer navigation items
    const customerNavItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.CUSTOMER_DASHBOARD },
        { icon: PlusCircle, label: 'Post Job', path: ROUTES.POST_JOB },
        { icon: Users, label: 'Browse Providers', path: ROUTES.BROWSE_PROVIDERS },
        { icon: DollarSign, label: 'Transactions', path: ROUTES.TRANSACTIONS },
    ];

    // Provider navigation items
    const providerNavItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.PROVIDER_DASHBOARD },
        { icon: Briefcase, label: 'Browse Jobs', path: ROUTES.BROWSE_JOBS },
        { icon: FileText, label: 'My Applications', path: ROUTES.MY_APPLICATIONS },
        { icon: UserCircle, label: 'Edit Profile', path: ROUTES.EDIT_PROFILE },
        { icon: DollarSign, label: 'Transactions', path: ROUTES.TRANSACTIONS },
    ];

    // Admin navigation items
    const adminNavItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD },
        { icon: AlertCircle, label: 'Disputes', path: ROUTES.ADMIN_DISPUTES },
    ];

    // Determine which nav items to show
    let navItems = [];
    if (isAdmin()) {
        navItems = adminNavItems;
    } else if (isProvider()) {
        navItems = providerNavItems;
    } else if (isCustomer()) {
        navItems = customerNavItems;
    }

    return (
        <aside className="hidden md:flex md:flex-col w-64 bg-background border-r border-border min-h-[calc(100vh-4rem)]">
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                                active
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="px-4 py-4 border-t border-border">
                <Link
                    to={ROUTES.SETTINGS}
                    className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                        isActive(ROUTES.SETTINGS)
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                >
                    <Settings className="w-5 h-5" />
                    Settings
                </Link>
            </div>
        </aside>
    );
};
