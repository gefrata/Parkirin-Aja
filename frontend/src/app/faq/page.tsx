'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { 
  Search,
  HelpCircle,
  BookOpen,
  Filter,
  ThumbsUp,
  MessageSquare,
  Share2,
  Copy,
  Download,
  Printer,
  ChevronRight,
  Star,
  TrendingUp,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Car,
  QrCode,
  CreditCard,
  MapPin,
  User,
  Calendar,
  Shield,
  Building,
  Smartphone,
  Mail,
  Phone,
  ExternalLink,
  Eye
} from 'lucide-react';
import Link from 'next/link';

// Data FAQ berdasarkan kategori
const faqData = {
  categories: [
    {
      id: 'booking',
      title: 'Booking & Reservations',
      icon: <Calendar className="h-5 w-5" />,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      count: 8
    },
    {
      id: 'access',
      title: 'Gate Access & QR Codes',
      icon: <QrCode className="h-5 w-5" />,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
      count: 6
    },
    {
      id: 'vehicles',
      title: 'Vehicle Management',
      icon: <Car className="h-5 w-5" />,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
      count: 7
    },
    {
      id: 'payment',
      title: 'Payment & Fees',
      icon: <CreditCard className="h-5 w-5" />,
      color: 'bg-amber-50',
      iconColor: 'text-amber-600',
      count: 5
    },
    {
      id: 'locations',
      title: 'Parking Locations',
      icon: <MapPin className="h-5 w-5" />,
      color: 'bg-red-50',
      iconColor: 'text-red-600',
      count: 6
    },
    {
      id: 'account',
      title: 'Account & Profile',
      icon: <User className="h-5 w-5" />,
      color: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      count: 5
    },
    {
      id: 'security',
      title: 'Security & Safety',
      icon: <Shield className="h-5 w-5" />,
      color: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      count: 4
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: <Smartphone className="h-5 w-5" />,
      color: 'bg-orange-50',
      iconColor: 'text-orange-600',
      count: 5
    }
  ],

  questions: [
    // Booking & Reservations
    {
      id: 'booking-1',
      category: 'booking',
      question: 'How do I book a parking spot?',
      answer: 'To book a parking spot: 1) Login to your account, 2) Go to "Book Parking" page, 3) Select your preferred parking location from the map or list, 4) Choose date and time, 5) Select your vehicle, 6) Confirm booking. You will receive a QR code for gate access.',
      helpful: 245,
      views: 1256,
      tags: ['basic', 'booking-process'],
      difficulty: 'easy'
    },
    {
      id: 'booking-2',
      category: 'booking',
      question: 'How far in advance can I book parking?',
      answer: 'You can book parking up to 7 days in advance. Same-day bookings must be made at least 1 hour before your intended arrival time.',
      helpful: 189,
      views: 987,
      tags: ['booking-time', 'advance'],
      difficulty: 'easy'
    },
    {
      id: 'booking-3',
      category: 'booking',
      question: 'Can I modify or cancel my booking?',
      answer: 'Yes, you can modify or cancel your booking up to 1 hour before the scheduled time. Go to "My Bookings" page, select the booking, and choose "Modify" or "Cancel". There is no penalty for cancellations made within this timeframe.',
      helpful: 167,
      views: 845,
      tags: ['modification', 'cancellation'],
      difficulty: 'medium'
    },
    {
      id: 'booking-4',
      category: 'booking',
      question: 'What happens if I\'m late for my booking?',
      answer: 'Your booking is reserved for 30 minutes after the scheduled start time. If you arrive later than this, your reservation may be released to other users. You can extend your booking via the app if you\'re running late.',
      helpful: 134,
      views: 723,
      tags: ['late-arrival', 'time-extension'],
      difficulty: 'medium'
    },

    // Gate Access & QR Codes
    {
      id: 'access-1',
      category: 'access',
      question: 'Why isn\'t my QR code scanning at the gate?',
      answer: 'Common solutions: 1) Increase your screen brightness to maximum, 2) Clean your screen, 3) Hold the QR code steady 10-15 cm from the scanner, 4) Ensure your booking is active (not cancelled or expired), 5) If problem persists, contact security at the gate.',
      helpful: 321,
      views: 1567,
      tags: ['qr-code', 'gate-access', 'troubleshooting'],
      difficulty: 'medium'
    },
    {
      id: 'access-2',
      category: 'access',
      question: 'What are the gate operating hours?',
      answer: 'Main campus gates operate from 06:00 to 23:00 daily. Security gates are closed from 23:00 to 06:00. Dosen/Staff parking areas have 24/7 access with special access cards. Plan your exit accordingly.',
      helpful: 278,
      views: 1345,
      tags: ['gate-hours', 'security', 'timing'],
      difficulty: 'easy'
    },

    // Vehicle Management
    {
      id: 'vehicles-1',
      category: 'vehicles',
      question: 'How do I register my vehicle?',
      answer: 'To register a vehicle: 1) Go to "Profile" → "Vehicles", 2) Click "Register Vehicle", 3) Fill in vehicle details (license plate, brand, model, color), 4) Upload clear photos of your STNK document, 5) Submit for verification. Verification usually takes 1-2 business days.',
      helpful: 298,
      views: 1456,
      tags: ['registration', 'stnk', 'verification'],
      difficulty: 'medium'
    },
    {
      id: 'vehicles-2',
      category: 'vehicles',
      question: 'Why is my STNK verification taking so long?',
      answer: 'STNK verification typically takes 1-2 business days. Delays may occur if: 1) STNK photo is unclear or incomplete, 2) License plate doesn\'t match registration, 3) Document is expired, 4) High volume of verification requests. You will receive email notification when verified.',
      helpful: 156,
      views: 789,
      tags: ['stnk', 'verification', 'delays'],
      difficulty: 'medium'
    },

    // Payment & Fees
    {
      id: 'payment-1',
      category: 'payment',
      question: 'Is parking really free for Polibatam students?',
      answer: 'Yes! Parking is completely FREE for all verified Polibatam students, dosen, and staff. This is a service provided by the institution. No payment is required at any time for campus parking.',
      helpful: 423,
      views: 1890,
      tags: ['free', 'payment', 'students'],
      difficulty: 'easy'
    },

    // Parking Locations
    {
      id: 'locations-1',
      category: 'locations',
      question: 'Where are the motorcycle parking areas?',
      answer: 'Motorcycle parking is available at: 1) Main Gate Parking (120 slots), 2) Behind Campus Workshop (80 slots), 3) Library Front (60 slots), 4) Student Center Area (100 slots). All locations are marked on the interactive map.',
      helpful: 234,
      views: 1123,
      tags: ['motorcycle', 'locations', 'map'],
      difficulty: 'easy'
    },

    // Account & Profile
    {
      id: 'account-1',
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'To reset your password: 1) On login page, click "Forgot Password", 2) Enter your registered email, 3) Check email for reset link, 4) Click link and create new password. Ensure new password meets requirements (8+ chars, uppercase, lowercase, number, special character).',
      helpful: 187,
      views: 945,
      tags: ['password', 'security', 'account'],
      difficulty: 'easy'
    },

    // Security & Safety
    {
      id: 'security-1',
      category: 'security',
      question: 'What should I do if my vehicle is damaged in the parking area?',
      answer: 'Immediately: 1) Take photos of the damage, 2) Note the time and exact location, 3) Contact campus security at +62-778-469858 Ext.1017, 4) File an incident report at Security Office, 5) Do not move vehicle until inspection if serious.',
      helpful: 198,
      views: 876,
      tags: ['damage', 'security', 'incident'],
      difficulty: 'high'
    },

    // Technical Support
    {
      id: 'technical-1',
      category: 'technical',
      question: 'The app is not loading/crashing. What should I do?',
      answer: 'Troubleshooting steps: 1) Check internet connection, 2) Clear app cache (Settings → Apps → Parking System → Clear Cache), 3) Update to latest app version, 4) Restart your device, 5) Try using web version at parkir.polibatam.ac.id, 6) Contact IT support if issue persists.',
      helpful: 167,
      views: 834,
      tags: ['app', 'technical', 'troubleshooting'],
      difficulty: 'medium'
    }
  ],

  popular: [
    'booking-1',
    'payment-1',
    'access-1',
    'vehicles-1',
    'locations-1'
  ],

  recent: [
    'technical-1',
    'security-1',
    'booking-4',
    'account-1'
  ]
};

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [helpfulQuestions, setHelpfulQuestions] = useState<string[]>([]);
  const [viewedQuestions, setViewedQuestions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  // Simulasi tracking helpful clicks
  const markHelpful = (questionId: string) => {
    if (!helpfulQuestions.includes(questionId)) {
      setHelpfulQuestions([...helpfulQuestions, questionId]);
      toast.success('Thank you for your feedback!');
    }
  };

  // Simulasi tracking views
  const trackView = (questionId: string) => {
    if (!viewedQuestions.includes(questionId)) {
      setViewedQuestions([...viewedQuestions, questionId]);
    }
  };

  // Filter questions berdasarkan search dan category
  const filteredQuestions = faqData.questions.filter(q => {
    const matchesSearch = searchQuery === '' || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get popular questions
  const popularQuestions = faqData.popular.map(id => 
    faqData.questions.find(q => q.id === id)
  ).filter(Boolean);

  // Get recent questions
  const recentQuestions = faqData.recent.map(id => 
    faqData.questions.find(q => q.id === id)
  ).filter(Boolean);

  // Get category questions count
  const getCategoryCount = (categoryId: string) => {
    return faqData.questions.filter(q => q.category === categoryId).length;
  };

  // Copy FAQ to clipboard
  const copyFAQ = (question: string, answer: string) => {
    const text = `Q: ${question}\nA: ${answer}`;
    navigator.clipboard.writeText(text);
    toast.success('FAQ copied to clipboard!');
  };

  // Share FAQ
  const shareFAQ = (question: string, id: string) => {
    if (navigator.share) {
      navigator.share({
        title: question,
        text: question,
        url: `${window.location.origin}/faq#${id}`
      });
    } else {
      copyFAQ(question, faqData.questions.find(q => q.id === id)?.answer || '');
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for: "${searchQuery}"`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <span className="text-sm font-medium text-gray-700">FAQ</span>
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
                <HelpCircle className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
                <p className="text-gray-600 mt-1">
                  Find answers to common questions about Polibatam Parking System
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Link href="/helpdesk">
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Need More Help?
                </Button>
              </Link>
              <Button variant="outline" className="gap-2">
                <Printer className="h-4 w-4" />
                Print FAQ
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search for questions about booking, access, vehicles, etc..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {filteredQuestions.length} results found
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="gap-2">
                      <Search className="h-4 w-4" />
                      Search
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
                <CardDescription>
                  Browse by topic
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => setSelectedCategory('all')}
                >
                  <BookOpen className="h-4 w-4" />
                  All Questions
                  <Badge className="ml-auto">{faqData.questions.length}</Badge>
                </Button>
                
                <Separator className="my-2" />
                
                {faqData.categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start gap-2"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className={`p-1 rounded ${category.iconColor}`}>
                      {category.icon}
                    </div>
                    <span className="text-left flex-1">{category.title}</span>
                    <Badge variant="outline" className="ml-auto">
                      {getCategoryCount(category.id)}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
              
              <CardFooter className="flex flex-col gap-3 border-t pt-6">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">Most Helpful FAQ</span>
                  </div>
                  <p className="text-xs">
                    &ldquo;Is parking free for students?&rdquo; helped 423 people
                  </p>
                </div>
                
                <Separator />
                
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Avg. Read Time</span>
                  </div>
                  <p className="text-xs">2-3 minutes per FAQ</p>
                </div>
              </CardFooter>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Total FAQs</span>
                    </div>
                    <span className="font-bold">{faqData.questions.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Total Views</span>
                    </div>
                    <span className="font-bold">
                      {faqData.questions.reduce((sum, q) => sum + q.views, 0).toLocaleString('en-Us')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">Helpful Votes</span>
                    </div>
                    <span className="font-bold">
                      {faqData.questions.reduce((sum, q) => sum + q.helpful, 0).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Resolution Rate</span>
                    </div>
                    <span className="font-bold text-green-600">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - FAQ List */}
          <div className="lg:col-span-3">
            {/* Tabs for different views */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="all">All FAQs</TabsTrigger>
                <TabsTrigger value="popular">Most Popular</TabsTrigger>
                <TabsTrigger value="recent">Recently Added</TabsTrigger>
                <TabsTrigger value="difficult">Most Difficult</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Search Results Info */}
            {searchQuery && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      Search results for &ldquo;{searchQuery}&rdquo;
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Clear search
                  </Button>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Found {filteredQuestions.length} matching questions
                </p>
              </div>
            )}

            {/* No Results Message */}
            {filteredQuestions.length === 0 && searchQuery && (
              <Card className="mb-6">
                <CardContent className="py-12 text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <HelpCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No results found for &ldquo;{searchQuery}&rdquo;
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto mb-6">
                    Try different keywords or browse categories
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => setSearchQuery('')}>
                      Clear Search
                    </Button>
                    <Link href="/helpdesk">
                      <Button>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Ask for Help
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* FAQ Accordion */}
            <Accordion type="multiple" className="space-y-4">
              {filteredQuestions.map((faq) => {
                const category = faqData.categories.find(c => c.id === faq.category);
                
                return (
                  <Card key={faq.id} className="overflow-hidden">
                    <AccordionItem value={faq.id} className="border-0">
                      <AccordionTrigger 
                        className="hover:no-underline px-6 py-4"
                        onClick={() => trackView(faq.id)}
                      >
                        <div className="flex items-start gap-4 text-left">
                          <div className={`p-2 rounded-lg ${category?.color} flex-shrink-0`}>
                            <div className={category?.iconColor}>
                              {category?.icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                {faq.question}
                              </span>
                              {faq.difficulty === 'high' && (
                                <Badge variant="destructive" className="text-xs">
                                  Advanced
                                </Badge>
                              )}
                              {faq.difficulty === 'medium' && (
                                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                  Intermediate
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                <span>{faq.views.toLocaleString()} views</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                <span>{faq.helpful} helpful</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{category?.title}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      
                      <AccordionContent className="px-6 pb-6">
                        <div className="pl-14 space-y-4">
                          {/* Answer */}
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 whitespace-pre-line">{faq.answer}</p>
                          </div>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2">
                            {faq.tags.map((tag) => (
                              <Badge 
                                key={tag} 
                                variant="outline" 
                                className="text-xs cursor-pointer hover:bg-gray-100"
                                onClick={() => setSearchQuery(tag)}
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          
                          {/* Actions */}
                          <div className="flex flex-wrap gap-3 pt-4 border-t">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2"
                              onClick={() => markHelpful(faq.id)}
                              disabled={helpfulQuestions.includes(faq.id)}
                            >
                              <ThumbsUp className="h-4 w-4" />
                              {helpfulQuestions.includes(faq.id) ? 'Thank You!' : 'Helpful'}
                              <span className="ml-1 text-xs">({faq.helpful})</span>
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2"
                              onClick={() => shareFAQ(faq.question, faq.id)}
                            >
                              <Share2 className="h-4 w-4" />
                              Share
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2"
                              onClick={() => copyFAQ(faq.question, faq.answer)}
                            >
                              <Copy className="h-4 w-4" />
                              Copy
                            </Button>
                            
                            <Link href={`/helpdesk?question=${encodeURIComponent(faq.question)}`} className="ml-auto">
                              <Button size="sm" variant="ghost" className="gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Still need help?
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                );
              })}
            </Accordion>

            {/* Popular Questions Section */}
            {selectedCategory === 'all' && !searchQuery && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Star className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Most Popular Questions</h2>
                      <p className="text-gray-600">Questions viewed by most users</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">
                    Top 5
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularQuestions.slice(0, 4).map((faq, index) => (
                    <Card key={faq?.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                              {faq?.question}
                            </h4>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-2">
                                <Eye className="h-3 w-3" />
                                <span>{faq?.views.toLocaleString()} views</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 text-xs"
                                onClick={() => {
                                  document.getElementById(faq?.id || '')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                              >
                                View Answer
                                <ChevronRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Still Need Help Section */}
            <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-lg">
                      <MessageSquare className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-blue-900 mb-2">Still need help?</h3>
                      <p className="text-blue-700">
                        Can't find what you're looking for? Our support team is ready to help you.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <div className="flex items-center gap-1 text-sm text-blue-600">
                          <Clock className="h-4 w-4" />
                          <span>Avg. response: 2 hours</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-blue-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>94% satisfaction rate</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/helpdesk">
                      <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                        <MessageSquare className="h-4 w-4" />
                        Contact Helpdesk
                      </Button>
                    </Link>
                    <Link href="/contact-security">
                      <Button variant="outline" className="gap-2">
                        <Shield className="h-4 w-4" />
                        Contact Security
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Tips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Search className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Search Tips</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Use specific keywords</li>
                        <li>• Try different phrasing</li>
                        <li>• Check spelling</li>
                        <li>• Browse categories</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Before Contacting</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Check FAQ first</li>
                        <li>• Note error messages</li>
                        <li>• Gather relevant info</li>
                        <li>• Try basic troubleshooting</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <ThumbsUp className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Help Improve FAQ</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Vote if answer helped</li>
                        <li>• Suggest new questions</li>
                        <li>• Report outdated info</li>
                        <li>• Share with others</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}