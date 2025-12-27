import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Bell, Check, X } from 'lucide-react';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/EmptyState';
import { notificationsAPI } from '../../lib/api';
import { formatRelativeTime } from '../../lib/utils';

export const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationsAPI.getAll();
            setNotifications(data.notifications || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationsAPI.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-600 mt-1">
                        {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button onClick={handleMarkAllAsRead} variant="outline">
                        <Check className="mr-2 w-4 h-4" />
                        Mark all as read
                    </Button>
                )}
            </div>

            {/* Notifications List */}
            <Card>
                <CardContent className="p-0">
                    {notifications.length === 0 ? (
                        <div className="p-8">
                            <EmptyState
                                icon="inbox"
                                title="No notifications"
                                description="You're all caught up! New notifications will appear here."
                            />
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`rounded-full p-2 ${!notification.isRead ? 'bg-blue-100' : 'bg-gray-100'
                                            }`}>
                                            <Bell className={`w-5 h-5 ${!notification.isRead ? 'text-blue-600' : 'text-gray-600'
                                                }`} />
                                        </div>

                                        <div className="flex-1">
                                            <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'
                                                }`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatRelativeTime(notification.createdAt)}
                                            </p>
                                        </div>

                                        {!notification.isRead && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleMarkAsRead(notification.id)}
                                            >
                                                <Check className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
