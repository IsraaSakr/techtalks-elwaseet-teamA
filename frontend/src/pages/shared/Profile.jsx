import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { User, Mail, Phone, MapPin, Briefcase, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        location: user?.location || '',
        bio: user?.bio || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // TODO: Implement save functionality
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            fullName: user?.fullName || '',
            email: user?.email || '',
            phone: user?.phone || '',
            location: user?.location || '',
            bio: user?.bio || '',
        });
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-muted/40 py-8">
            <div className="mx-auto max-w-3xl px-4 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
                        <p className="text-muted-foreground mt-1">Manage your account information</p>
                    </div>
                    {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} className="rounded-full">
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit Profile
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button onClick={handleSave} className="rounded-full">
                                <Save className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                            <Button variant="outline" onClick={handleCancel} className="rounded-full">
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>

                {/* Profile Card */}
                <Card className="rounded-3xl shadow-lg border border-border">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Avatar className="w-20 h-20 ring-4 ring-background shadow-md">
                                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                    {user?.fullName?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">{user?.fullName}</h2>
                                <Badge className="mt-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                    {user?.role?.toUpperCase()}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                                {isEditing ? (
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="rounded-xl"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-foreground">
                                        <User className="w-4 h-4 text-primary" />
                                        <span>{user?.fullName}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-foreground">Email</Label>
                                {isEditing ? (
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="rounded-xl"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-foreground">
                                        <Mail className="w-4 h-4 text-primary" />
                                        <span>{user?.email}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-foreground">Phone</Label>
                                {isEditing ? (
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="rounded-xl"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-foreground">
                                        <Phone className="w-4 h-4 text-primary" />
                                        <span>{user?.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-foreground">Location</Label>
                                {isEditing ? (
                                    <Input
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="rounded-xl"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-foreground">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span>{user?.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {(user?.role === 'provider' || user?.role === 'hybrid') && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <Label className="text-foreground">Services</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {user?.services?.map((service, index) => (
                                            <Badge 
                                                key={index} 
                                                className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 border-none"
                                            >
                                                <Briefcase className="w-3 h-3 mr-1" />
                                                {service}
                                            </Badge>
                                        )) || <span className="text-muted-foreground">No services listed</span>}
                                    </div>
                                </div>
                            </>
                        )}

                        {user?.bio && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <Label className="text-foreground">Bio</Label>
                                    <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Account Information */}
                <Card className="rounded-3xl shadow-lg border border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-border">
                            <span className="text-muted-foreground">Account Status</span>
                            <Badge className="rounded-full bg-primary/10 text-primary border-none">
                                {user?.isVerified ? 'Verified' : 'Unverified'}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-border">
                            <span className="text-muted-foreground">Member Since</span>
                            <span className="text-foreground">{new Date(user?.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-muted-foreground">User ID</span>
                            <span className="text-foreground font-mono text-sm">{user?.id}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
