'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { AlertCircle, Bug, CheckCircle, Computer, Globe, Smartphone, Upload, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// Data untuk dropdown options
const bugLocations = [
  { value: 'dashboard', label: 'Dashboard', description: 'Halaman dashboard utama' },
  { value: 'booking', label: 'Booking System', description: 'Form reservasi parkir' },
  { value: 'profile', label: 'Profile Page', description: 'Halaman profil pengguna' },
  { value: 'login', label: 'Login/Register', description: 'Halaman autentikasi' },
  { value: 'payment', label: 'Payment System', description: 'Sistem pembayaran' },
  { value: 'map', label: 'Interactive Map', description: 'Peta interaktif parkir' },
  { value: 'vehicles', label: 'Vehicle Management', description: 'Manajemen kendaraan' },
  { value: 'notifications', label: 'Notifications', description: 'Sistem notifikasi' },
  { value: 'mobile', label: 'Mobile App', description: 'Aplikasi mobile' },
  { value: 'other', label: 'Other Location', description: 'Lokasi lainnya' },
];

const deviceOptions = [
  { value: 'desktop', label: 'Desktop Computer', icon: <Computer className="h-4 w-4" /> },
  { value: 'laptop', label: 'Laptop', icon: <Computer className="h-4 w-4" /> },
  { value: 'smartphone', label: 'Smartphone', icon: <Smartphone className="h-4 w-4" /> },
  { value: 'tablet', label: 'Tablet', icon: <Smartphone className="h-4 w-4" /> },
  { value: 'other-device', label: 'Other Device', icon: <Computer className="h-4 w-4" /> },
];

const browserOptions = [
  { value: 'chrome', label: 'Google Chrome' },
  { value: 'firefox', label: 'Mozilla Firefox' },
  { value: 'safari', label: 'Apple Safari' },
  { value: 'edge', label: 'Microsoft Edge' },
  { value: 'opera', label: 'Opera' },
  { value: 'brave', label: 'Brave' },
  { value: 'other-browser', label: 'Other Browser' },
];

const osOptions = [
  { value: 'windows', label: 'Windows' },
  { value: 'macos', label: 'macOS' },
  { value: 'linux', label: 'Linux' },
  { value: 'android', label: 'Android' },
  { value: 'ios', label: 'iOS' },
  { value: 'other-os', label: 'Other OS' },
];

// Pre-fill dengan data browser (opsional)
const getBrowserInfo = () => {
  if (typeof window === 'undefined') return { browser: '', os: '' };
  
  const userAgent = navigator.userAgent;
  let browser = '';
  let os = '';

  // Detect browser
  if (userAgent.includes('Chrome')) browser = 'chrome';
  else if (userAgent.includes('Firefox')) browser = 'firefox';
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'safari';
  else if (userAgent.includes('Edg')) browser = 'edge';
  else browser = 'other-browser';

  // Detect OS
  if (userAgent.includes('Win')) os = 'windows';
  else if (userAgent.includes('Mac')) os = 'macos';
  else if (userAgent.includes('Linux')) os = 'linux';
  else if (userAgent.includes('Android')) os = 'android';
  else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'ios';
  else os = 'other-os';

  return { browser, os };
};

export default function ReportIssuePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    bug_location: '',
    details: '',
    device_used: '',
    browser: '',
    operating_system: '',
    steps_to_reproduce: '',
    expected_behavior: '',
    actual_behavior: '',
    priority: 'medium',
  });

  // Auto-detect browser and OS on component mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const { browser, os } = getBrowserInfo();
      setFormData(prev => ({
        ...prev,
        browser,
        operating_system: os,
      }));
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.details) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create issue data
      const issueData = {
        ...formData,
        files: selectedFiles.length > 0 ? selectedFiles.map(f => f.name) : [],
        submitted_at: new Date().toISOString(),
        user_id: user?.id,
        ticket_number: `BUG-${Date.now().toString().slice(-6)}`,
      };

      console.log('Issue reported:', issueData);
      
      // Success
      setSubmitted(true);
      toast.success('Issue reported successfully!', {
        description: `Ticket #${issueData.ticket_number} has been created.`,
        duration: 5000,
      });

      // Reset form
      setFormData({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        bug_location: '',
        details: '',
        device_used: '',
        browser: '',
        operating_system: '',
        steps_to_reproduce: '',
        expected_behavior: '',
        actual_behavior: '',
        priority: 'medium',
      });
      setSelectedFiles([]);

    } catch (error) {
      console.error('Error submitting issue:', error);
      toast.error('Failed to submit issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types and size
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'video/mp4'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        toast.error(`File type not supported: ${file.name}`);
        return false;
      }
      
      if (file.size > maxSize) {
        toast.error(`File too large (max 10MB): ${file.name}`);
        return false;
      }
      
      return true;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
    
    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} file(s) added`);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center border-green-200 bg-gradient-to-b from-green-50 to-white">
            <CardHeader className="space-y-4">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Issue Reported Successfully!</CardTitle>
              <CardDescription>
                Thank you for helping us improve the Polibatam Parking System
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Ticket Number:</span>
                    <Badge className="bg-blue-100 text-blue-800 font-mono">BUG-{Date.now().toString().slice(-6)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Submitted:</span>
                    <span className="font-medium">{new Date().toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-left">
                      <h4 className="font-medium text-blue-900">What happens next?</h4>
                      <ul className="text-sm text-blue-700 mt-2 space-y-1">
                        <li>• Our team will review your report within 24-48 hours</li>
                        <li>• You'll receive updates via email ({formData.email})</li>
                        <li>• We may contact you for additional information</li>
                        <li>• Check your ticket status in your profile</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => setSubmitted(false)}
                className="gap-2"
              >
                <Bug className="h-4 w-4" />
                Report Another Issue
              </Button>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button className="w-full gap-2">
                  Back to Dashboard
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Recent Issues Tips */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Tips for Effective Bug Reports</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Be Specific</h4>
                <p className="text-sm text-gray-600">Include exact steps to reproduce the issue</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Add Screenshots</h4>
                <p className="text-sm text-gray-600">Visual evidence helps us understand faster</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Check for Updates</h4>
                <p className="text-sm text-gray-600">Ensure your browser/app is up to date</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <span className="text-sm font-medium text-gray-700">Report Issue</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Bug className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Report an Issue</h1>
              <p className="text-gray-600 mt-1">
                Help us improve the Polibatam Parking System by reporting bugs or issues
              </p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Before You Report</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Check if the issue has already been reported in known issues</li>
                  <li>• Try refreshing the page or clearing your browser cache</li>
                  <li>• Include as much detail as possible to help us reproduce the issue</li>
                  <li>• Screenshots or screen recordings are extremely helpful</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issue Report Form</CardTitle>
            <CardDescription>
              Fill out the form below to report a bug or issue. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">
                      First Name *
                    </Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      placeholder="John"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="last_name">
                      Last Name *
                    </Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john.doe@polibatam.ac.id"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    We'll send updates about this issue to this email
                  </p>
                </div>
              </div>

              {/* Bug Information Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Bug Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="bug_location">
                    Where was this bug found? *
                  </Label>
                  <Select 
                    value={formData.bug_location} 
                    onValueChange={(value) => setFormData({...formData, bug_location: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select where you encountered the issue" />
                    </SelectTrigger>
                    <SelectContent>
                      {bugLocations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          <div className="flex flex-col">
                            <span>{location.label}</span>
                            <span className="text-xs text-gray-500">{location.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="details">
                    Details *
                    <span className="text-xs text-gray-500 ml-2">Describe the issue in detail</span>
                  </Label>
                  <Textarea
                    id="details"
                    value={formData.details}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                    placeholder="What happened? What were you trying to do?"
                    className="min-h-[120px]"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expected_behavior">
                      Expected Behavior
                    </Label>
                    <Textarea
                      id="expected_behavior"
                      value={formData.expected_behavior}
                      onChange={(e) => setFormData({...formData, expected_behavior: e.target.value})}
                      placeholder="What should have happened?"
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="actual_behavior">
                      Actual Behavior
                    </Label>
                    <Textarea
                      id="actual_behavior"
                      value={formData.actual_behavior}
                      onChange={(e) => setFormData({...formData, actual_behavior: e.target.value})}
                      placeholder="What actually happened?"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="steps_to_reproduce">
                    Steps to Reproduce
                  </Label>
                  <Textarea
                    id="steps_to_reproduce"
                    value={formData.steps_to_reproduce}
                    onChange={(e) => setFormData({...formData, steps_to_reproduce: e.target.value})}
                    placeholder="1. Go to...&#10;2. Click on...&#10;3. Observe..."
                    className="min-h-[100px] font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Numbered steps help us reproduce the issue exactly
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">
                    Issue Priority
                  </Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value) => setFormData({...formData, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          Low Priority - Minor inconvenience
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          Medium Priority - Affects functionality
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          High Priority - Blocks core features
                        </div>
                      </SelectItem>
                      <SelectItem value="critical">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          Critical - System crash or data loss
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Technical Information Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Technical Information</h3>
                <p className="text-sm text-gray-600">
                  This helps us identify environment-specific issues
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="device_used">
                      Device Used
                    </Label>
                    <Select 
                      value={formData.device_used} 
                      onValueChange={(value) => setFormData({...formData, device_used: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select device" />
                      </SelectTrigger>
                      <SelectContent>
                        {deviceOptions.map((device) => (
                          <SelectItem key={device.value} value={device.value}>
                            <div className="flex items-center gap-2">
                              {device.icon}
                              {device.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="browser">
                      Browser
                    </Label>
                    <Select 
                      value={formData.browser} 
                      onValueChange={(value) => setFormData({...formData, browser: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select browser" />
                      </SelectTrigger>
                      <SelectContent>
                        {browserOptions.map((browser) => (
                          <SelectItem key={browser.value} value={browser.value}>
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              {browser.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="operating_system">
                      Operating System
                    </Label>
                    <Select 
                      value={formData.operating_system} 
                      onValueChange={(value) => setFormData({...formData, operating_system: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select OS" />
                      </SelectTrigger>
                      <SelectContent>
                        {osOptions.map((os) => (
                          <SelectItem key={os.value} value={os.value}>
                            {os.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Attachments Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Attachments</h3>
                <p className="text-sm text-gray-600">
                  Upload screenshots, error messages, or screen recordings (max 10MB per file)
                </p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.mp4"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="font-medium mb-2">Click to upload files</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Drag & drop or click to browse
                    </p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>• Supported: JPG, PNG, GIF, WebP, PDF, MP4</p>
                      <p>• Maximum size: 10MB per file</p>
                      <p>• Maximum files: 5</p>
                    </div>
                  </label>
                </div>
                
                {/* File List */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Files ({selectedFiles.length})</Label>
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded">
                              <Upload className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Privacy Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Privacy Notice</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your information will be used only to investigate and resolve this issue. 
                      We may contact you for additional details. Screenshots may contain 
                      sensitive information - please blur/remove any personal data before uploading.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between border-t pt-6">
              <div className="text-sm text-gray-600">
                <p>Need immediate assistance?</p>
                <p className="font-medium">📞 Contact Security: 0778-123456</p>
              </div>
              
              <div className="flex gap-3">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Bug className="h-4 w-4" />
                      Submit Issue Report
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Help Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Computer className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold">Common Issues</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Map not loading properly</li>
                <li>• Booking form validation errors</li>
                <li>• Payment processing issues</li>
                <li>• Profile picture upload fails</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Globe className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold">Browser Tips</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Clear browser cache regularly</li>
                <li>• Update to latest browser version</li>
                <li>• Disable browser extensions temporarily</li>
                <li>• Try incognito/private mode</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold">Response Time</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Critical issues: Within 4 hours</li>
                <li>• High priority: Within 24 hours</li>
                <li>• Medium priority: 2-3 business days</li>
                <li>• Low priority: Up to 1 week</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}