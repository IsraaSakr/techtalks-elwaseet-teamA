import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
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

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useNavigation } from '../../hooks/useNavigation';

export const Sidebar = ({ isOpen = true, toggle }) => {
    const location = useLocation();
    const { navItems } = useNavigation();

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <aside 
            className={cn(
                "hidden md:flex flex-col bg-background border-r border-border min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out relative",
                isOpen ? "w-64" : "w-20"
            )}
        >
            {/* Toggle Button */}
            <button
                onClick={toggle}
                className="absolute -right-3 top-6 bg-background border border-border rounded-full p-1 hover:bg-accent transition-colors z-10"
            >
                {isOpen ? (
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
            </button>

            <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                                active
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                !isOpen && "justify-start px-2"
                            )}
                            title={!isOpen ? item.label : undefined}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            {isOpen && <span className="truncate">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="px-4 py-4 border-t border-border">
                <Link
                    to={ROUTES.SETTINGS}
                    className={cn(
                        'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                        isActive(ROUTES.SETTINGS)
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                         !isOpen && "justify-start px-2"
                    )}
                    title={!isOpen ? "Settings" : undefined}
                >
                    <Settings className="w-5 h-5 shrink-0" />
                    {isOpen && <span className="truncate">Settings</span>}
                </Link>
            </div>
        </aside>
    );
};
