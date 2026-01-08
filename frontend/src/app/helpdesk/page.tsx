'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  FileText,
  Calendar,
  Search,
  Filter,
  Download,
  Printer,
  Bell,
  Car,
  MapPin,
  Shield,
  CreditCard,
  User,
  ChevronRight,
  Star,
  TrendingUp,
  MessageCircle,
  Eye,
  Ticket,
  QrCode,
  Building,
  History
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

// Data kategori bantuan khusus parkir
const parkingHelpCategories = [
  {
    id: 'booking',
    title: 'Parking Booking Issues',
    description: 'Problems with reserving parking spots',
    icon: <Calendar className="h-6 w-6" />,
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    topics: [
      'Cannot book parking slot',
      'Booking time conflicts',
      'Payment processing errors',
      'Slot not available',
      'Double booking issues'
    ]
  },
  {
    id: 'payment',
    title: 'Payment & Fees',
    description: 'Parking fees, payments, and billing',
    icon: <CreditCard className="h-6 w-6" />,
    color: 'bg-green-50 border-green-200',
    iconColor: 'text-green-600',
    topics: [
      'Payment failed',
      'Invoice issues',
      'Refund requests',
      'Payment verification',
      'Free parking queries'
    ]
  },
  {
    id: 'access',
    title: 'Access & Entry Issues',
    description: 'Gate access, QR codes, and entry problems',
    icon: <QrCode className="h-6 w-6" />,
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600',
    topics: [
      'QR code not working',
      'Gate not opening',
      'Access denied',
      'Entry/exit problems',
      'Gate timing issues'
    ]
  },
  {
    id: 'vehicles',
    title: 'Vehicle Management',
    description: 'Vehicle registration and STNK issues',
    icon: <Car className="h-6 w-6" />,
    color: 'bg-amber-50 border-amber-200',
    iconColor: 'text-amber-600',
    topics: [
      'Vehicle registration',
      'STNK verification',
      'Multiple vehicles',
      'Vehicle information update',
      'Default vehicle setting'
    ]
  },
  {
    id: 'locations',
    title: 'Parking Locations',
    description: 'Finding and navigating to parking areas',
    icon: <MapPin className="h-6 w-6" />,
    color: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600',
    topics: [
      'Cannot find parking location',
      'Wrong location on map',
      'Directions to parking',
      'Location availability',
      'Parking lot full'
    ]
  },
  {
    id: 'account',
    title: 'Account & Profile',
    description: 'User account and profile settings',
    icon: <User className="h-6 w-6" />,
    color: 'bg-cyan-50 border-cyan-200',
    iconColor: 'text-cyan-600',
    topics: [
      'Login problems',
      'Profile update issues',
      'Password reset',
      'Account verification',
      'Role/permission issues'
    ]
  }
];

// Data FAQ parkir populer
const parkingFAQs = [
  {
    question: 'How do I book a parking spot?',
    answer: 'Login to the parking system, select location, choose time slot, and confirm booking.',
    category: 'booking',
    views: 1245
  },
  {
    question: 'Why is my QR code not scanning at the gate?',
    answer: 'Ensure your screen brightness is maximum. If issue persists, contact security at gate.',
    category: 'access',
    views: 987
  },
  {
    question: 'How to register my vehicle?',
    answer: 'Go to Profile → Vehicles → Register Vehicle. Upload STNK for verification.',
    category: 'vehicles',
    views: 876
  },
  {
    question: 'Is parking really free for Polibatam students?',
    answer: 'Yes, parking is free for verified Polibatam students and staff with valid credentials.',
    category: 'payment',
    views: 765
  },
  {
    question: 'What if I need to cancel my booking?',
    answer: 'Go to My Bookings → Select booking → Cancel. Cancellation 1 hour before is free.',
    category: 'booking',
    views: 654
  }
];

// Data kontak helpdesk parkir
const parkingHelpdeskContacts = [
  {
    id: 'security-helpdesk',
    department: 'Security Helpdesk',
    description: 'Parking access and gate issues',
    contacts: [
      { type: 'phone', value: '+62-778-469858 Ext.1017', label: 'Security Line' },
      { type: 'whatsapp', value: '+62-821-7255-7099', label: 'WhatsApp (Emergency)' },
      { type: 'email', value: 'security@polibatam.ac.id', label: 'Email' }
    ],
    hours: '24/7',
    location: 'Main Gate Security Office',
    color: 'bg-red-50'
  },
  {
    id: 'parking-admin',
    department: 'Parking Administration',
    description: 'Booking and account issues',
    contacts: [
      { type: 'phone', value: '+62-778-469858 Ext.1025', label: 'Parking Admin' },
      { type: 'email', value: 'parking@polibatam.ac.id', label: 'Email' }
    ],
    hours: '08:00 - 17:00 (Mon-Fri)',
    location: 'Administration Building, Room 205',
    color: 'bg-blue-50'
  },
  {
    id: 'technical-support',
    department: 'Technical Support',
    description: 'App and system technical issues',
    contacts: [
      { type: 'phone', value: '+62-778-469858 Ext.2001', label: 'IT Support' },
      { type: 'email', value: 'it-support@polibatam.ac.id', label: 'Email' }
    ],
    hours: '07:00 - 21:00 (Mon-Sat)',
    location: 'Building A, Room 101',
    color: 'bg-green-50'
  }
];

// Data tickets parkir contoh
const parkingTickets = [
  {
    id: 'PARK-2024-001234',
    subject: 'QR code not scanning at North Gate',
    category: 'Access & Entry Issues',
    status: 'open',
    priority: 'high',
    created: '2024-01-15 09:30',
    lastUpdate: '2024-01-15 14:45',
    assignedTo: 'Security Team'
  },
  {
    id: 'PARK-2024-001233',
    subject: 'Vehicle registration pending for 3 days',
    category: 'Vehicle Management',
    status: 'in_progress',
    priority: 'medium',
    created: '2024-01-14 11:20',
    lastUpdate: '2024-01-15 10:15',
    assignedTo: 'Parking Admin'
  },
  {
    id: 'PARK-2024-001232',
    subject: 'Cannot book parking for tomorrow',
    category: 'Parking Booking Issues',
    status: 'resolved',
    priority: 'low',
    created: '2024-01-12 14:00',
    lastUpdate: '2024-01-13 16:30',
    assignedTo: 'Technical Support'
  },
  {
    id: 'PARK-2024-001231',
    subject: 'Parking slot shown available but cannot book',
    category: 'Parking Booking Issues',
    status: 'closed',
    priority: 'high',
    created: '2024-01-10 10:45',
    lastUpdate: '2024-01-11 15:20',
    assignedTo: 'Technical Support'
  }
];

export default function ParkingHelpdeskPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('submit');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [formData, setFormData] = useState({
    name: user ? `${user.first_name} ${user.last_name}` : '',
    email: user?.email || '',
    studentId: user?.nim || '',
    category: '',
    subject: '',
    description: '',
    priority: 'medium',
    parking_location: '',
    vehicle_plate: '',
    booking_id: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.subject || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const ticketNumber = `PARK-2024-${Math.floor(100000 + Math.random() * 900000)}`;
      
      toast.success('Parking ticket submitted successfully!', {
        description: `Ticket #${ticketNumber} has been created.`,
        duration: 5000,
        action: {
          label: 'View Ticket',
          onClick: () => setActiveTab('my-tickets')
        }
      });

      // Reset form
      setFormData({
        name: user ? `${user.first_name} ${user.last_name}` : '',
        email: user?.email || '',
        studentId: user?.nim || '',
        category: '',
        subject: '',
        description: '',
        priority: 'medium',
        parking_location: '',
        vehicle_plate: '',
        booking_id: '',
      });
      setSelectedCategory('');

    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast.error('Failed to submit ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (category: string, title: string) => {
    setSelectedCategory(category);
    setFormData({...formData, category: title});
    setActiveTab('submit');
    toast.info(`Selected category: ${title}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching parking help for: "${searchQuery}"`);
      // Implement search logic here
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-100 text-blue-800">Open</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
                  Dashboard
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-sm font-medium text-gray-700">Parking Helpdesk</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Car className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Parking System Helpdesk</h1>
                <p className="text-gray-600 mt-1">
                  Get assistance for parking booking, access, and vehicle management issues
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setActiveTab('my-tickets')}
              >
                <Ticket className="h-4 w-4" />
                My Parking Tickets
              </Button>
              <Link href="/contact-security">
                <Button variant="outline" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Contact Security
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Avg. Response Time</p>
                    <p className="text-2xl font-bold">2.1 hours</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Parking Tickets Today</p>
                    <p className="text-2xl font-bold">23</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Resolution Rate</p>
                    <p className="text-2xl font-bold">96%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Support</p>
                    <p className="text-2xl font-bold">6</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Bar */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search parking FAQs or describe your issue..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Button type="submit" className="h-12 px-6">
                  Search
                </Button>
                <Button type="button" variant="outline" className="h-12" onClick={() => setActiveTab('faq')}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Browse FAQs
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="submit" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Submit Ticket
                </TabsTrigger>
                <TabsTrigger value="my-tickets" className="gap-2">
                  <Ticket className="h-4 w-4" />
                  My Tickets
                </TabsTrigger>
                <TabsTrigger value="faq" className="gap-2">
                  <HelpCircle className="h-4 w-4" />
                  FAQ
                </TabsTrigger>
              </TabsList>

              {/* Submit Ticket Tab */}
              <TabsContent value="submit" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Submit Parking Help Ticket</CardTitle>
                    <CardDescription>
                      Report issues with parking booking, access, or vehicle management
                    </CardDescription>
                  </CardHeader>
                  
                  <form onSubmit={handleSubmitTicket}>
                    <CardContent className="space-y-6">
                      {/* Quick Category Selection */}
                      <div className="space-y-3">
                        <Label>What is your issue about?</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {parkingHelpCategories.map((category) => (
                            <Button
                              key={category.id}
                              type="button"
                              variant="outline"
                              className={`h-auto py-3 flex-col gap-2 ${selectedCategory === category.id ? 'border-2 border-blue-500' : ''}`}
                              onClick={() => handleQuickAction(category.id, category.title)}
                            >
                              <div className={`p-2 rounded-full ${category.iconColor} bg-white`}>
                                {category.icon}
                              </div>
                              <span className="text-xs font-medium">{category.title}</span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Personal Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="student@polibatam.ac.id"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="studentId">Student ID / NIM</Label>
                          <Input
                            id="studentId"
                            value={formData.studentId}
                            onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                            placeholder="123-45678-9012"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="vehicle_plate">Vehicle Plate</Label>
                          <Input
                            id="vehicle_plate"
                            value={formData.vehicle_plate}
                            onChange={(e) => setFormData({...formData, vehicle_plate: e.target.value.toUpperCase()})}
                            placeholder="B 1234 XYZ"
                            className="uppercase"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority Level</Label>
                          <Select 
                            value={formData.priority} 
                            onValueChange={(value) => setFormData({...formData, priority: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low - General Inquiry</SelectItem>
                              <SelectItem value="medium">Medium - Needs Attention</SelectItem>
                              <SelectItem value="high">High - Urgent/Gate Access</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Parking Specific Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="parking_location">Parking Location</Label>
                          <Select 
                            value={formData.parking_location} 
                            onValueChange={(value) => setFormData({...formData, parking_location: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select parking location" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="main-gate">Main Gate Parking</SelectItem>
                              <SelectItem value="library">Library Parking</SelectItem>
                              <SelectItem value="workshop">Workshop Area</SelectItem>
                              <SelectItem value="administration">Administration Building</SelectItem>
                              <SelectItem value="student-center">Student Center</SelectItem>
                              <SelectItem value="other">Other Location</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="booking_id">Booking ID (if any)</Label>
                          <Input
                            id="booking_id"
                            value={formData.booking_id}
                            onChange={(e) => setFormData({...formData, booking_id: e.target.value})}
                            placeholder="PB-123456"
                          />
                        </div>
                      </div>

                      {/* Category Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="category">Issue Category *</Label>
                        <Select 
                          value={formData.category} 
                          onValueChange={(value) => setFormData({...formData, category: value})}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select issue category" />
                          </SelectTrigger>
                          <SelectContent>
                            {parkingHelpCategories.map((category) => (
                              <SelectItem key={category.id} value={category.title}>
                                <div className="flex items-center gap-2">
                                  <div className={`p-1 rounded ${category.iconColor}`}>
                                    {category.icon}
                                  </div>
                                  <div>
                                    <div>{category.title}</div>
                                    <div className="text-xs text-gray-500">{category.description}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Ticket Details */}
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          placeholder="Brief description of your parking issue"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">
                          Detailed Description *
                          <span className="text-xs text-gray-500 ml-2">Describe what happened and when</span>
                        </Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Example: Tried to scan QR code at Main Gate at 14:30 but gate didn't open. Screen showed 'Access Denied' error."
                          className="min-h-[150px]"
                          required
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          Tip: Include date, time, location, and exact error messages if any
                        </div>
                      </div>

                      {/* Emergency Notice */}
                      {formData.priority === 'high' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-red-900">High Priority Notice</h4>
                              <p className="text-sm text-red-700 mt-1">
                                For urgent gate access issues, also contact Security immediately at 
                                <Button 
                                  variant="link" 
                                  className="h-auto p-0 ml-1 text-red-700 font-semibold"
                                  onClick={() => window.open('tel:+62778469858', '_blank')}
                                >
                                  +62-778-469858 Ext.1017
                                </Button>
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="flex justify-between border-t pt-6">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setActiveTab('faq')}
                      >
                        Check Parking FAQ First
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="gap-2 bg-blue-600 hover:bg-blue-700"
                      >
                        {loading ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Ticket className="h-4 w-4" />
                            Submit Parking Ticket
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              {/* My Tickets Tab */}
              <TabsContent value="my-tickets" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>My Parking Support Tickets</CardTitle>
                        <CardDescription>Track status of your parking-related tickets</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setActiveTab('submit')}>
                          <Ticket className="h-4 w-4 mr-2" />
                          New Ticket
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Ticket ID</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Subject</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Priority</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parkingTickets.map((ticket) => (
                            <tr key={ticket.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div className="font-mono text-sm font-medium">{ticket.id}</div>
                                <div className="text-xs text-gray-500">{ticket.created}</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-medium text-sm">{ticket.subject}</div>
                                <div className="text-xs text-gray-500">Assigned to: {ticket.assignedTo}</div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant="outline" className="text-xs">
                                  {ticket.category}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                {getStatusBadge(ticket.status)}
                              </td>
                              <td className="py-3 px-4">
                                {getPriorityBadge(ticket.priority)}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <MessageCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {parkingTickets.length === 0 && (
                      <div className="text-center py-12">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Ticket className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No parking tickets yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-6">
                          You haven't submitted any parking-related support tickets.
                        </p>
                        <Button onClick={() => setActiveTab('submit')} className="gap-2">
                          <Ticket className="h-4 w-4" />
                          Submit First Parking Ticket
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* FAQ Tab */}
              <TabsContent value="faq" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Parking System FAQs</CardTitle>
                    <CardDescription>
                      Quick answers to common parking system questions
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Popular FAQs */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Most Common Parking Questions</h3>
                        <Badge variant="outline" className="bg-blue-50">
                          {parkingFAQs.length} FAQs
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        {parkingFAQs.map((faq, index) => (
                          <Card key={index} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="text-xs">
                                      {faq.category}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <Eye className="h-3 w-3" />
                                      {faq.views.toLocaleString()} views
                                    </div>
                                  </div>
                                  <h4 className="font-medium mb-2">{faq.question}</h4>
                                  <p className="text-sm text-gray-600">{faq.answer}</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400 mt-1" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Browse by Category */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Help by Category</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {parkingHelpCategories.map((category) => (
                          <Card 
                            key={category.id} 
                            className={`cursor-pointer hover:shadow-lg transition-all ${category.color}`}
                            onClick={() => handleQuickAction(category.id, category.title)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${category.iconColor} bg-white`}>
                                  {category.icon}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-2">{category.title}</h4>
                                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {category.topics.slice(0, 3).map((topic, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {topic}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Help Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Parking Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full gap-2 bg-red-600 hover:bg-red-700"
                  onClick={() => window.open('tel:+62778469858', '_blank')}
                >
                  <Phone className="h-4 w-4" />
                  Emergency Gate Issue
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => window.open('https://wa.me/6282172557099', '_blank')}
                >
                  <MessageSquare className="h-4 w-4" />
                  WhatsApp Security
                </Button>
                
                <Link href="/booking">
                  <Button variant="outline" className="w-full gap-2">
                    <Calendar className="h-4 w-4" />
                    Book Parking Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Parking Helpdesk Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Parking Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {parkingHelpdeskContacts.map((dept) => (
                  <div key={dept.id} className={`p-3 rounded-lg ${dept.color}`}>
                    <div className="font-medium text-sm mb-1">{dept.department}</div>
                    <p className="text-xs text-gray-600 mb-2">{dept.description}</p>
                    <div className="space-y-1">
                      {dept.contacts.slice(0, 2).map((contact, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-gray-600">{contact.label}:</span>
                          <Button
                            variant="link"
                            className="h-auto p-0 text-xs"
                            onClick={() => {
                              if (contact.type === 'phone') {
                                window.open(`tel:${contact.value.replace(/[^0-9+]/g, '')}`, '_blank');
                              } else if (contact.type === 'email') {
                                window.open(`mailto:${contact.value}`, '_blank');
                              } else if (contact.type === 'whatsapp') {
                                window.open(`https://wa.me/${contact.value.replace(/[^0-9]/g, '')}`, '_blank');
                              }
                            }}
                          >
                            {contact.value}
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {dept.hours}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Parking Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Parking Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm">Main Gate</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">42 slots free</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Library</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">12 slots free</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm">Workshop</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">28 slots free</Badge>
                </div>
                
                <Separator />
                
                <Button 
                  variant="ghost" 
                  className="w-full text-sm justify-center"
                  onClick={() => window.location.href = '/booking'}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  View All Parking Lots
                </Button>
              </CardContent>
            </Card>

            {/* Quick Guides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Guides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: 'How to Book Parking', icon: <Calendar className="h-4 w-4" />, link: '/booking' },
                  { title: 'Vehicle Registration', icon: <Car className="h-4 w-4" />, link: '/profile?tab=vehicles' },
                  { title: 'QR Code Usage', icon: <QrCode className="h-4 w-4" /> },
                  { title: 'Parking Rules', icon: <FileText className="h-4 w-4" /> },
                ].map((item, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    className="w-full justify-start gap-2 text-sm"
                    onClick={() => item.link && (window.location.href = item.link)}
                  >
                    {item.icon}
                    {item.title}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Customer Satisfaction */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Parking Help Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">4.7</div>
                  <div className="flex justify-center mb-2">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500/50" />
                  </div>
                  <p className="text-sm text-gray-600">Based on 892 parking help reviews</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <QrCode className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Gate Access Tips</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Ensure screen brightness is maximum</li>
                    <li>• Hold QR code steady at scanner</li>
                    <li>• Check booking status is "active"</li>
                    <li>• Contact security if gate malfunctions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Car className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Vehicle Registration</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Upload clear STNK photo</li>
                    <li>• License plate must match STNK</li>
                    <li>• Verification takes 1-2 days</li>
                    <li>• Set default vehicle for quick booking</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Booking Tips</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Book at least 1 hour in advance</li>
                    <li>• Check gate closing times (23:00)</li>
                    <li>• Cancel if not needed</li>
                    <li>• Save favorite locations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}