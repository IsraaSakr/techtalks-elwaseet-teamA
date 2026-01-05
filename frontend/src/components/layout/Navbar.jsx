import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '../ui/sheet';
import {
    Menu,
    LogOut,
    User,
    Settings,
    Briefcase,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth'; 
import { useNavigation } from '../../hooks/useNavigation';
import { ROUTES } from '../../lib/constants';

export const Navbar = () => {
    const { user, logout, isProvider, isCustomer, isAdmin } = useAuth();
    const { navItems } = useNavigation();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate(ROUTES.LOGIN);
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getDashboardLink = () => {
        if (isAdmin()) return ROUTES.ADMIN_DASHBOARD;
        if (isProvider()) return ROUTES.PROVIDER_DASHBOARD;
        if (isCustomer()) return ROUTES.CUSTOMER_DASHBOARD;
        return ROUTES.HOME;
    };

    return (
        <nav className="bg-background border-b border-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to={getDashboardLink()} className="flex items-center gap-2">
                        <Briefcase className="w-8 h-8 text-primary" />
                        <span className="text-xl font-bold text-foreground">
                            elwaseet
                        </span>
                    </Link>

                    {/* Right side */}
                    <div className="flex items-center gap-4">

                        {/* User Menu - Desktop */}
                        <div className="hidden md:block relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                            >
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={user?.avatar} alt={user?.fullName} />
                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                        {getInitials(user?.fullName)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium text-gray-700">
                                    {user?.fullName}
                                </span>
                            </button>

                            {showUserMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowUserMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                                        <Link
                                            to={ROUTES.PROFILE}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <User className="w-4 h-4" />
                                            My Profile
                                        </Link>
                                        <Link
                                            to={ROUTES.SETTINGS}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </Link>
                                        <hr className="my-2" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-64">
                                <div className="flex flex-col gap-4 mt-8">
                                    {/* User Info */}
                                    <div className="flex items-center gap-3 pb-4 border-b">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={user?.avatar} alt={user?.fullName} />
                                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                                {getInitials(user?.fullName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-gray-900">{user?.fullName}</p>
                                            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                                        </div>
                                    </div>

                                    {/* Navigation Links */}
                                    <div className="space-y-1">
                                        {navItems.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                                                >
                                                    <Icon className="w-4 h-4" />
                                                    {item.label}
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    <hr className="my-2" />

                                    <Link
                                        to={ROUTES.PROFILE}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                                    >
                                        <User className="w-4 h-4" />
                                        My Profile
                                    </Link>
                                    <Link
                                        to={ROUTES.SETTINGS}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
};
