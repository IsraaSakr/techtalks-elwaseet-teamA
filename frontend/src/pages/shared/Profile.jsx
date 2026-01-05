import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Dialog, DialogContent, DialogTrigger } from '../../components/ui/dialog';
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Briefcase, 
    Edit2, 
    Save, 
    X,
    Calendar,
    CheckCircle,
    Award,
    Clock,
    Shield,
    Image as ImageIcon
} from 'lucide-react';
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

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U';
    };

    return (
        <div className="min-h-screen bg-muted/40 pb-6">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
                <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-center">
                    <h2 className="text-base font-semibold text-foreground truncate">
                        My Profile
                    </h2>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column (Sidebar) - Profile Summary */}
                    <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-6">
                        <Card className="bg-card border border-border rounded-3xl shadow-lg p-6">
                            <div className="text-center space-y-4">
                                <div className="relative inline-block">
                                    <Avatar className="w-32 h-32 mx-auto ring-4 ring-background shadow-md">
                                        {/* Placeholder for avatar upload */}
                                        <AvatarFallback className="bg-primary/10 text-primary text-3xl font-semibold">
                                            {getInitials(user?.fullName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {isEditing && (
                                        <Button 
                                            size="icon" 
                                            variant="secondary" 
                                            className="absolute bottom-0 right-0 rounded-full shadow-md w-8 h-8"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    {isEditing ? (
                                        <Input
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="text-center text-lg font-bold h-9"
                                            placeholder="Full Name"
                                        />
                                    ) : (
                                        <h1 className="text-2xl font-bold text-foreground">
                                            {user?.fullName}
                                        </h1>
                                    )}
                                    
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        {isEditing ? (
                                            <Input
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                className="h-8 text-sm w-32"
                                                placeholder="Location"
                                            />
                                        ) : (
                                            <span>{user?.location || 'Location not set'}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap justify-center gap-2">
                                    <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 text-xs font-medium border-none uppercase">
                                        {user?.role}
                                    </Badge>
                                    {user?.isVerified && (
                                        <Badge className="rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20 px-3 py-1 text-xs font-medium border-none">
                                            Verified
                                        </Badge>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="pt-6 flex gap-2 justify-center">
                                    {!isEditing ? (
                                        <Button onClick={() => setIsEditing(true)} className="w-full rounded-xl bg-primary hover:bg-primary/90">
                                            <Edit2 className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    ) : (
                                        <>
                                            <Button onClick={handleSave} className="flex-1 rounded-xl bg-primary hover:bg-primary/90">
                                                <Save className="w-4 h-4 mr-2" />
                                                Save
                                            </Button>
                                            <Button variant="outline" onClick={handleCancel} className="flex-1 rounded-xl">
                                                <X className="w-4 h-4 mr-2" />
                                                Cancel
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column (Main Content) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            <Card className="rounded-2xl border border-border/60 shadow-sm bg-card">
                                <CardContent className="p-3 text-center space-y-1">
                                    <Calendar className="w-5 h-5 mx-auto text-primary" />
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Joined</p>
                                    <p className="text-sm font-bold text-foreground">
                                        {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="rounded-2xl border border-border/60 shadow-sm bg-card">
                                <CardContent className="p-3 text-center space-y-1">
                                    <Shield className="w-5 h-5 mx-auto text-primary" />
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Status</p>
                                    <p className="text-sm font-bold text-foreground">
                                        {user?.isVerified ? 'Verified' : 'Unverified'}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="rounded-2xl border border-border/60 shadow-sm bg-card">
                                <CardContent className="p-3 text-center space-y-1">
                                    <Award className="w-5 h-5 mx-auto text-primary" />
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Role</p>
                                    <p className="text-sm font-bold text-foreground capitalize">
                                        {user?.role}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Info */}
                        <Card className="rounded-3xl border border-border shadow-sm p-6">
                            <div className="space-y-4">
                                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" />
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Email</Label>
                                        {isEditing ? (
                                            <Input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="rounded-xl"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 font-medium">
                                                <Mail className="w-4 h-4 text-muted-foreground" />
                                                {user?.email}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Phone</Label>
                                        {isEditing ? (
                                            <Input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="rounded-xl"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 font-medium">
                                                <Phone className="w-4 h-4 text-muted-foreground" />
                                                {user?.phone || 'Not provided'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Bio Section */}
                        <Card className="rounded-3xl border border-border shadow-sm p-6">
                            <div className="space-y-3">
                                <h3 className="text-base font-semibold text-foreground">About Me</h3>
                                {isEditing ? (
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="w-full min-h-[120px] rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {user?.bio || 'No bio available yet.'}
                                    </p>
                                )}
                            </div>
                        </Card>

                        {/* Conditional Sections for Providers/Hybrid */}
                        {(user?.role === 'provider' || user?.role === 'hybrid') && (
                            <>
                                {/* Services */}
                                <Card className="rounded-3xl border border-border shadow-sm p-6">
                                    <div className="space-y-3">
                                        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                                            <Briefcase className="w-5 h-5 text-primary" />
                                            My Services
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {user?.services?.map((service, index) => (
                                                <Badge 
                                                    key={index} 
                                                    className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1.5"
                                                >
                                                    {service}
                                                </Badge>
                                            )) || <p className="text-sm text-muted-foreground italic">No services listed</p>}
                                        </div>
                                    </div>
                                </Card>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
