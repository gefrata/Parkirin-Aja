'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Bell, 
  CreditCard, 
  Car, 
  History,
  Edit,
  Save,
  X,
  Check,
  LogOut,
  ArrowLeft,
  Key,
  Globe,
  Moon,
  Plus,
  Trash2,
  Star,
  Camera,
  QrCode,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Upload,
  Home
} from 'lucide-react';
// Import komponen sidebar
import { 
  SidebarProvider, 
  SidebarTrigger,
  SidebarInset 
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

// Define Vehicle type dengan STNK
interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
  color: string;
  type: 'car' | 'motorcycle' | 'suv' | 'truck' | 'ev';
  year: string;
  is_default: boolean;
  notes?: string;
  stnk_file?: File | string;
  stnk_status: 'pending' | 'verified' | 'rejected';
  stnk_verified_at?: string;
  stnk_rejection_reason?: string;
  created_at?: string;
}

export default function ProfilePage() {
  const { user, updateUser, logout, isLoading } = useAuth(); // Tambah isLoading jika ada di context
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    promotions: false
  });
  const [darkMode, setDarkMode] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
  });

  // Vehicle state dengan STNK verification
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      license_plate: 'B 1234 XYZ',
      brand: 'Toyota',
      model: 'Camry',
      color: 'Black',
      type: 'car',
      year: '2022',
      is_default: true,
      notes: 'Main family car',
      stnk_status: 'verified',
      stnk_verified_at: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      license_plate: 'B 5678 ABC',
      brand: 'Honda',
      model: 'CBR250RR',
      color: 'Red',
      type: 'motorcycle',
      year: '2023',
      is_default: false,
      stnk_status: 'verified',
      stnk_verified_at: '2024-02-20T14:45:00Z',
    },
    {
      id: '3',
      license_plate: 'B 9012 DEF',
      brand: 'Tesla',
      model: 'Model 3',
      color: 'White',
      type: 'ev',
      year: '2023',
      is_default: false,
      notes: 'Electric vehicle',
      stnk_status: 'pending',
    },
    {
      id: '4',
      license_plate: 'B 3456 GHI',
      brand: 'Mitsubishi',
      model: 'Pajero Sport',
      color: 'Silver',
      type: 'suv',
      year: '2021',
      is_default: false,
      stnk_status: 'rejected',
      stnk_rejection_reason: 'STNK unclear, please re-upload clearer image',
    },
  ]);

  // Initialize form dengan user data
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: '+62 812-3456-7890',
        address: '123 Main St, Jakarta, Indonesia',
        bio: 'Parking system enthusiast. Always looking for the best parking spots!',
      });
    }
  }, [user]);

  // Redirect jika user tidak login
  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      updateUser({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
      });

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: '+62 812-3456-7890',
        address: '123 Main St, Jakarta, Indonesia',
        bio: 'Parking system enthusiast. Always looking for the best parking spots!',
      });
    }
    setIsEditing(false);
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.info(`${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${!notifications[key] ? 'enabled' : 'disabled'}`);
  };

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    router.push('/login');
  };

  const handleAddVehicle = (newVehicle: Omit<Vehicle, 'id'>) => {
    const vehicleWithId = {
      ...newVehicle,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      stnk_status: 'pending', // Default status untuk kendaraan baru
    };
    
    setVehicles([...vehicles, vehicleWithId]);
    setShowAddVehicle(false);
    toast.success('Vehicle registered successfully! STNK verification in progress...');
  };

  const handleVehicleUpdate = (updatedVehicles: Vehicle[]) => {
    setVehicles(updatedVehicles);
  };

  // Calculate verification statistics
  const verificationStats = {
    total: vehicles.length,
    verified: vehicles.filter(v => v.stnk_status === 'verified').length,
    pending: vehicles.filter(v => v.stnk_status === 'pending').length,
    rejected: vehicles.filter(v => v.stnk_status === 'rejected').length,
  };

  // Tambah loading state yang lebih jelas
  if (isLoading || (!user && isLoading === undefined)) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p>Loading profile...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!user) {
    return null; // Akan redirect ke login
  }

  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="flex h-16 items-center px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
                <p className="text-sm text-gray-500">Manage your account settings</p>
              </div>
            </div>
            
            <div className="ml-auto flex items-center gap-4">
              {/* Quick Actions */}
              <Link href="/dashboard">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="hidden sm:flex gap-2"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              
              {/* User Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {user?.first_name?.[0] || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-medium">
                    {user?.category === 'dosen' ? 'Dosen' : 'Mahasiswa'}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate max-w-[100px]">
                    {user?.nim || user?.email?.split('@')[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-4 md:p-6 lg:p-8 bg-gradient-to-b from-gray-50 to-white">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Summary */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {user.first_name} {user.last_name}
                      </h3>
                      <p className="text-gray-600">{user.email}</p>
                    </div>

                    <Badge variant="outline" className="gap-1">
                      <Shield className="h-3 w-3" />
                      {user.provider === 'email' ? 'Email Account' : 
                       user.provider === 'google' ? 'Google Account' : 
                       user.provider === 'github' ? 'GitHub Account' : 'Facebook Account'}
                    </Badge>

                    <div className="w-full space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Joined {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Car className="h-4 w-4 mr-2" />
                        <span>{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} registered</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <History className="h-4 w-4 mr-2" />
                        <span>24 parking sessions</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </CardFooter>
              </Card>

              {/* Vehicle Verification Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">STNK Verification Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-gray-600">Verified</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {verificationStats.verified}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-gray-600">Pending</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {verificationStats.pending}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-gray-600">Rejected</span>
                      </div>
                      <Badge className="bg-red-100 text-red-800">
                        {verificationStats.rejected}
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-sm text-gray-500">
                    <p className="font-medium mb-1">Verification Notes:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Verified vehicles can book parking immediately</li>
                      <li>Pending verification takes 1-2 business days</li>
                      <li>Rejected STNK requires re-upload</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Tabs */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid grid-cols-5 mb-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal details and contact information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">First Name *</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="first_name"
                              value={formData.first_name}
                              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                              className="pl-10"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Last Name *</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="last_name"
                              value={formData.last_name}
                              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                              className="pl-10"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="pl-10"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="pl-10"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="pl-10"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                          className="min-h-[100px] resize-none"
                          disabled={!isEditing}
                          placeholder="Tell us a bit about yourself..."
                        />
                      </div>

                      {isEditing && (
                        <div className="flex justify-end space-x-3 pt-4">
                          <Button variant="outline" onClick={handleCancelEdit}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button onClick={handleSaveProfile} disabled={loading}>
                            {loading ? (
                              <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Vehicles Tab */}
                <TabsContent value="vehicles">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>My Vehicles with STNK Verification</CardTitle>
                          <CardDescription>
                            Manage your registered vehicles with STNK verification for secure parking
                          </CardDescription>
                        </div>
                        <Button onClick={() => setShowAddVehicle(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Register Vehicle
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Di sini Anda perlu menambahkan VehicleList komponen yang sesuai */}
                      <div className="space-y-4">
                        {vehicles.map((vehicle) => (
                          <Card key={vehicle.id}>
                            <CardContent className="pt-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-bold">{vehicle.brand} {vehicle.model}</h4>
                                  <p className="text-gray-600">{vehicle.license_plate} • {vehicle.color} • {vehicle.year}</p>
                                  <Badge className={`mt-2 ${
                                    vehicle.stnk_status === 'verified' ? 'bg-green-100 text-green-800' :
                                    vehicle.stnk_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {vehicle.stnk_status === 'verified' ? '✓ Verified' :
                                     vehicle.stnk_status === 'pending' ? '⏳ Pending' : '✗ Rejected'}
                                  </Badge>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">Edit</Button>
                                  <Button size="sm" variant="destructive">Delete</Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      {/* Verification Guidelines */}
                      <Card className="mt-6 bg-blue-50 border-blue-200">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-blue-600" />
                            STNK Verification Guidelines
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-700">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <p className="font-medium">✅ DOs:</p>
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Upload clear, high-resolution image or PDF</li>
                                <li>Ensure all text is readable</li>
                                <li>Include all pages if multi-page document</li>
                                <li>Verify license plate matches registration</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <p className="font-medium">❌ DON'Ts:</p>
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Don't upload blurry or cropped images</li>
                                <li>Avoid screenshots of digital documents</li>
                                <li>Don't edit or alter the document</li>
                                <li>Avoid expired STNK documents</li>
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Settings</CardTitle>
                      <CardDescription>
                        Choose how you want to be notified about your parking activities
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Email Notifications</Label>
                            <p className="text-sm text-gray-500">Receive updates about your parking sessions via email</p>
                          </div>
                          <Switch
                            checked={notifications.email}
                            onCheckedChange={() => handleNotificationToggle('email')}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">SMS Notifications</Label>
                            <p className="text-sm text-gray-500">Get text messages for urgent updates</p>
                          </div>
                          <Switch
                            checked={notifications.sms}
                            onCheckedChange={() => handleNotificationToggle('sms')}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Push Notifications</Label>
                            <p className="text-sm text-gray-500">Receive browser/app notifications</p>
                          </div>
                          <Switch
                            checked={notifications.push}
                            onCheckedChange={() => handleNotificationToggle('push')}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Promotional Offers</Label>
                            <p className="text-sm text-gray-500">Get updates about discounts and special offers</p>
                          </div>
                          <Switch
                            checked={notifications.promotions}
                            onCheckedChange={() => handleNotificationToggle('promotions')}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">STNK Verification Updates</Label>
                            <p className="text-sm text-gray-500">Get notified when your STNK verification status changes</p>
                          </div>
                          <Switch
                            checked={true}
                            onCheckedChange={() => {}}
                            disabled
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        <Bell className="h-4 w-4 mr-2" />
                        Save Notification Preferences
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>
                        Manage your password and account security
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Change Password</h4>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor="current_password">Current Password</Label>
                              <Input id="current_password" type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new_password">New Password</Label>
                              <Input id="new_password" type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirm_password">Confirm New Password</Label>
                              <Input id="confirm_password" type="password" />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h4 className="font-medium mb-2">Document Security</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <div>
                                  <p className="font-medium">STNK Documents</p>
                                  <p className="text-sm text-gray-500">Encrypted and securely stored</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                Secure
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-3">
                      <Button className="w-full">
                        <Key className="h-4 w-4 mr-2" />
                        Update Password
                      </Button>
                      <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                        Delete Account
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences">
                  <Card>
                    <CardHeader>
                      <CardTitle>App Preferences</CardTitle>
                      <CardDescription>
                        Customize your parking system experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Dark Mode</Label>
                            <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                          </div>
                          <Switch
                            checked={darkMode}
                            onCheckedChange={setDarkMode}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label>Default Parking Duration</Label>
                          <select className="w-full p-2 border rounded-md">
                            <option>2 hours</option>
                            <option>4 hours</option>
                            <option>8 hours</option>
                            <option>12 hours</option>
                          </select>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label>Preferred Vehicle for Booking</Label>
                          <select className="w-full p-2 border rounded-md">
                            <option>Always ask</option>
                            <option>Use default vehicle</option>
                            <option>Last used vehicle</option>
                          </select>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label>STNK Verification Preference</Label>
                          <select className="w-full p-2 border rounded-md">
                            <option>Show only verified vehicles</option>
                            <option>Show all vehicles with status</option>
                            <option>Hide rejected vehicles</option>
                          </select>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label>Preferred Currency</Label>
                          <select className="w-full p-2 border rounded-md">
                            <option>USD ($)</option>
                            <option>IDR (Rp)</option>
                            <option>EUR (€)</option>
                            <option>GBP (£)</option>
                          </select>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label>Language</Label>
                          <select className="w-full p-2 border rounded-md">
                            <option>English</option>
                            <option>Bahasa Indonesia</option>
                            <option>Español</option>
                            <option>Français</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}