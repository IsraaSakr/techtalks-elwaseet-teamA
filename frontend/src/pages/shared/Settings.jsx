import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { Bell, Lock, User, Mail, Shield, Trash2, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Settings = () => {
    const { user, logout } = useAuth();
    const [successMessage, setSuccessMessage] = useState('');
    const [saving, setSaving] = useState(false);

    // Notification Settings
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        pushNotifications: true,
        jobApplications: true,
        jobUpdates: true,
        messages: true,
        marketing: false,
    });

    // Password Change
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleNotificationChange = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveNotifications = async () => {
        setSaving(true);
        try {
            // TODO: Implement actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccessMessage('Notification preferences saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error saving notifications:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return;
        }

        setSaving(true);
        try {
            // TODO: Implement actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccessMessage('Password changed successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error changing password:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            // TODO: Implement account deletion
            console.log('Account deletion requested');
        }
    };

    return (
        <div className="max-w-4xl space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your account preferences and security</p>
            </div>

            {successMessage && (
                <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
                </Alert>
            )}

            {/* Account Information */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        <CardTitle>Account Information</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-semibold text-gray-900">{user?.fullName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-900">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Role</p>
                            <p className="text-gray-900 capitalize">{user?.role}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Member Since</p>
                            <p className="text-gray-900">{new Date(user?.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        <CardTitle>Notification Preferences</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="emailNotifications">Email Notifications</Label>
                                <p className="text-sm text-gray-500">Receive notifications via email</p>
                            </div>
                            <Switch
                                id="emailNotifications"
                                checked={notifications.emailNotifications}
                                onCheckedChange={() => handleNotificationChange('emailNotifications')}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="pushNotifications">Push Notifications</Label>
                                <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                            </div>
                            <Switch
                                id="pushNotifications"
                                checked={notifications.pushNotifications}
                                onCheckedChange={() => handleNotificationChange('pushNotifications')}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="jobApplications">Job Applications</Label>
                                <p className="text-sm text-gray-500">Notifications about new applications</p>
                            </div>
                            <Switch
                                id="jobApplications"
                                checked={notifications.jobApplications}
                                onCheckedChange={() => handleNotificationChange('jobApplications')}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="jobUpdates">Job Updates</Label>
                                <p className="text-sm text-gray-500">Updates on your posted or applied jobs</p>
                            </div>
                            <Switch
                                id="jobUpdates"
                                checked={notifications.jobUpdates}
                                onCheckedChange={() => handleNotificationChange('jobUpdates')}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="messages">Messages</Label>
                                <p className="text-sm text-gray-500">Notifications for new messages</p>
                            </div>
                            <Switch
                                id="messages"
                                checked={notifications.messages}
                                onCheckedChange={() => handleNotificationChange('messages')}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="marketing">Marketing Emails</Label>
                                <p className="text-sm text-gray-500">Receive promotional emails and updates</p>
                            </div>
                            <Switch
                                id="marketing"
                                checked={notifications.marketing}
                                onCheckedChange={() => handleNotificationChange('marketing')}
                            />
                        </div>
                    </div>

                    <Button onClick={handleSaveNotifications} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        <CardTitle>Security</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                placeholder="Enter current password"
                                disabled={saving}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="Enter new password"
                                disabled={saving}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder="Confirm new password"
                                disabled={saving}
                            />
                        </div>
                    </div>

                    <Button
                        onClick={handleChangePassword}
                        disabled={
                            !passwordData.currentPassword ||
                            !passwordData.newPassword ||
                            !passwordData.confirmPassword ||
                            passwordData.newPassword !== passwordData.confirmPassword ||
                            saving
                        }
                    >
                        {saving ? 'Changing...' : 'Change Password'}
                    </Button>
                </CardContent>
            </Card>

            {/* Privacy & Data */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        <CardTitle>Privacy & Data</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Download Your Data</h4>
                        <p className="text-sm text-gray-600 mb-3">
                            Request a copy of your personal data stored on our platform
                        </p>
                        <Button variant="outline" disabled>
                            <Mail className="w-4 h-4 mr-2" />
                            Request Data Export
                        </Button>
                    </div>

                    <Separator />

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-red-600">Danger Zone</h4>
                        <p className="text-sm text-gray-600 mb-3">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Session Management */}
            <Card>
                <CardHeader>
                    <CardTitle>Session</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" onClick={logout}>
                        Sign Out
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
