'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Users, 
  Shield, 
  AlertTriangle, 
  Building,
  Clock,
  ExternalLink,
  FileText,
  PhoneCall,
  Smartphone,
  Globe,
  Printer,
  User,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

// Data kontak security dan departments
const securityContacts = [
  {
    id: 'main-gate',
    title: 'Security Main Gate',
    department: 'Campus Security',
    description: '24/7 security at main entrance gate',
    contacts: [
      { type: 'phone', value: '+62-778-469858 Ext.1017', label: 'Main Line', icon: <Phone className="h-4 w-4" /> },
      { type: 'whatsapp', value: '+62-821-7255-7099', label: 'WhatsApp (Emergency)', icon: <MessageSquare className="h-4 w-4" /> },
      { type: 'radio', value: 'Channel 7', label: 'Security Radio', icon: <PhoneCall className="h-4 w-4" /> },
    ],
    location: 'Main Entrance Gate',
    operationalHours: '24/7',
    emergency: true,
    color: 'bg-red-50 border-red-200',
    icon: <Shield className="h-6 w-6 text-red-600" />
  },
  {
    id: 'security-office',
    title: 'Security Office',
    department: 'Security Department',
    description: 'Main security administration office',
    contacts: [
      { type: 'phone', value: '+62-778-469858 Ext.1018', label: 'Office Line', icon: <Phone className="h-4 w-4" /> },
      { type: 'email', value: 'security@polibatam.ac.id', label: 'Email', icon: <Mail className="h-4 w-4" /> },
    ],
    location: 'Ground Floor, Administration Building',
    operationalHours: '07:00 - 21:00',
    emergency: false,
    color: 'bg-blue-50 border-blue-200',
    icon: <Building className="h-6 w-6 text-blue-600" />
  },
  {
    id: 'cctv-room',
    title: 'CCTV Monitoring Room',
    department: 'Surveillance',
    description: 'CCTV monitoring and incident response',
    contacts: [
      { type: 'phone', value: '+62-778-469858 Ext.1019', label: 'Monitoring Line', icon: <Phone className="h-4 w-4" /> },
      { type: 'internal', value: 'Ext. 1020', label: 'Internal Extension', icon: <PhoneCall className="h-4 w-4" /> },
    ],
    location: 'Security Building, 1st Floor',
    operationalHours: '24/7',
    emergency: true,
    color: 'bg-purple-50 border-purple-200',
    icon: <AlertTriangle className="h-6 w-6 text-purple-600" />
  },
  {
    id: 'patrol-team',
    title: 'Patrol Team',
    department: 'Mobile Security',
    description: 'On-ground security patrol team',
    contacts: [
      { type: 'phone', value: '+62-821-7255-7100', label: 'Patrol Mobile', icon: <Smartphone className="h-4 w-4" /> },
      { type: 'radio', value: 'Channel 5', label: 'Patrol Radio', icon: <PhoneCall className="h-4 w-4" /> },
    ],
    location: 'Mobile - Campus Wide',
    operationalHours: '06:00 - 23:00',
    emergency: true,
    color: 'bg-green-50 border-green-200',
    icon: <Users className="h-6 w-6 text-green-600" />
  },
];

const departmentContacts = [
  {
    id: 'public-relations',
    title: 'Public Relations',
    description: 'Media and public inquiries',
    contacts: [
      { type: 'email', value: 'humas@polibatam.ac.id', label: 'Official Email', icon: <Mail className="h-4 w-4" /> },
      { type: 'phone', value: '+62-778-469858 Ext.1001', label: 'PR Office', icon: <Phone className="h-4 w-4" /> },
    ],
    color: 'bg-amber-50 border-amber-200',
  },
  {
    id: 'information-desk',
    title: 'Information Desk',
    description: 'General campus information',
    contacts: [
      { type: 'phone', value: '+62-778-469858 Ext.1000', label: 'Information', icon: <Phone className="h-4 w-4" /> },
      { type: 'email', value: 'info@polibatam.ac.id', label: 'Info Email', icon: <Mail className="h-4 w-4" /> },
    ],
    color: 'bg-cyan-50 border-cyan-200',
  },
  {
    id: 'facilities',
    title: 'Facilities Management',
    description: 'Campus maintenance and facilities',
    contacts: [
      { type: 'phone', value: '+62-778-469858 Ext.1021', label: 'Facilities Office', icon: <Phone className="h-4 w-4" /> },
      { type: 'whatsapp', value: '+62-821-7255-7101', label: 'Emergency Maintenance', icon: <MessageSquare className="h-4 w-4" /> },
    ],
    color: 'bg-orange-50 border-orange-200',
  },
];

const emergencyContacts = [
  {
    id: 'police',
    title: 'Local Police',
    number: '110',
    description: 'Batam City Police Department',
    note: 'For criminal incidents',
  },
  {
    id: 'ambulance',
    title: 'Ambulance / Medical',
    number: '118',
    description: 'Emergency medical services',
    note: 'For medical emergencies',
  },
  {
    id: 'fire',
    title: 'Fire Department',
    number: '113',
    description: 'Batam Fire Department',
    note: 'For fire emergencies',
  },
];

export default function ContactSecurityPage() {
  const [selectedContact, setSelectedContact] = useState(securityContacts[0]);
  const [quickAction, setQuickAction] = useState<'call' | 'whatsapp' | 'email' | null>(null);

  const handleCall = (phoneNumber: string) => {
    const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
    toast.info(`Calling ${phoneNumber}`, {
      description: 'Opening phone dialer...',
      action: {
        label: 'Copy Number',
        onClick: () => {
          navigator.clipboard.writeText(cleanNumber);
          toast.success('Phone number copied to clipboard');
        }
      }
    });
    
    // In real app, you would use: window.location.href = `tel:${cleanNumber}`;
  };

  const handleWhatsApp = (phoneNumber: string) => {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    const message = `Hello Polibatam Security, I need assistance from Parking System.`;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    
    toast.info('Opening WhatsApp...', {
      description: 'You will be redirected to WhatsApp',
    });
    
    window.open(url, '_blank');
  };

  const handleEmail = (email: string) => {
    const subject = 'Parking System Inquiry';
    const body = `Dear Polibatam Security,\n\nI am contacting you regarding the Parking System.\n\nBest regards,\n[Your Name]`;
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(url, '_blank');
    toast.success('Opening email client...');
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleQuickAction = (type: 'call' | 'whatsapp' | 'email', value: string) => {
    setQuickAction(type);
    
    setTimeout(() => {
      setQuickAction(null);
      switch (type) {
        case 'call':
          handleCall(value);
          break;
        case 'whatsapp':
          handleWhatsApp(value);
          break;
        case 'email':
          handleEmail(value);
          break;
      }
    }, 500);
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
                  <span className="text-sm font-medium text-gray-700">Contact Security</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Polibatam Security Contact</h1>
                <p className="text-gray-600 mt-1">
                  24/7 security services for Politeknik Negeri Batam community
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => handleCall('+62778469858')}
              >
                <Phone className="h-4 w-4" />
                Quick Call
              </Button>
              <Link href="/report-issue">
                <Button variant="outline" className="gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Report Issue
                </Button>
              </Link>
            </div>
          </div>

          {/* Emergency Banner */}
          <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-red-900 mb-2">⚠️ Emergency Contacts</h3>
                    <p className="text-red-700">
                      For immediate assistance, call Security Main Gate or use emergency numbers below
                    </p>
                  </div>
                </div>
                <Button 
                  className="bg-red-600 hover:bg-red-700 gap-2"
                  onClick={() => handleCall('+6282172557099')}
                >
                  <Phone className="h-4 w-4" />
                  Emergency Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contact List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Security Contacts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Security Departments</h2>
                <Badge variant="outline" className="bg-red-50 text-red-700">
                  {securityContacts.length} Teams
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {securityContacts.map((contact) => (
                  <Card 
                    key={contact.id} 
                    className={`cursor-pointer hover:shadow-lg transition-all ${contact.color} ${
                      selectedContact.id === contact.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg">
                            {contact.icon}
                          </div>
                          <div>
                            <CardTitle className="text-base">{contact.title}</CardTitle>
                            <CardDescription className="text-xs">{contact.department}</CardDescription>
                          </div>
                        </div>
                        {contact.emergency && (
                          <Badge variant="destructive" className="text-xs">
                            Emergency
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-3">
                      <p className="text-sm text-gray-600 mb-3">{contact.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-700">{contact.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-700">{contact.operationalHours}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        {contact.contacts.map((contactInfo, idx) => (
                          <Button
                            key={idx}
                            size="sm"
                            variant="outline"
                            className="text-xs h-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (contactInfo.type === 'phone') handleCall(contactInfo.value);
                              else if (contactInfo.type === 'whatsapp') handleWhatsApp(contactInfo.value);
                              else if (contactInfo.type === 'email') handleEmail(contactInfo.value);
                            }}
                          >
                            {contactInfo.icon}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Other Departments */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Other Departments</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {departmentContacts.map((dept) => (
                  <Card key={dept.id} className={dept.color}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{dept.title}</CardTitle>
                      <CardDescription className="text-xs">{dept.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pb-3">
                      <div className="space-y-2">
                        {dept.contacts.map((contact, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {contact.icon}
                              <span className="text-sm">{contact.label}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 text-xs"
                              onClick={() => {
                                if (contact.type === 'phone') handleCall(contact.value);
                                else if (contact.type === 'whatsapp') handleWhatsApp(contact.value);
                                else if (contact.type === 'email') handleEmail(contact.value);
                              }}
                            >
                              Contact
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Emergency Numbers */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Emergency Services</h2>
              
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {emergencyContacts.map((emergency) => (
                      <div key={emergency.id} className="text-center">
                        <div className="text-3xl font-bold text-red-600 mb-2">{emergency.number}</div>
                        <h4 className="font-semibold mb-1">{emergency.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{emergency.description}</p>
                        <p className="text-xs text-gray-500">{emergency.note}</p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-3 gap-2"
                          onClick={() => handleCall(emergency.number)}
                        >
                          <Phone className="h-3 w-3" />
                          Call {emergency.number}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Selected Contact Details */}
          <div className="space-y-6">
            {/* Selected Contact Card */}
            <Card className="sticky top-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Contact Details</CardTitle>
                  {selectedContact.emergency && (
                    <Badge variant="destructive">Emergency</Badge>
                  )}
                </div>
                <CardDescription>
                  {selectedContact.department} • {selectedContact.location}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Quick Actions */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Quick Actions</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedContact.contacts.find(c => c.type === 'phone') && (
                      <Button 
                        variant="outline" 
                        className={`gap-2 ${quickAction === 'call' ? 'bg-green-50 border-green-200' : ''}`}
                        onClick={() => {
                          const phone = selectedContact.contacts.find(c => c.type === 'phone')?.value;
                          if (phone) handleQuickAction('call', phone);
                        }}
                      >
                        <Phone className="h-4 w-4" />
                        Call
                      </Button>
                    )}
                    
                    {selectedContact.contacts.find(c => c.type === 'whatsapp') && (
                      <Button 
                        variant="outline" 
                        className={`gap-2 ${quickAction === 'whatsapp' ? 'bg-green-50 border-green-200' : ''}`}
                        onClick={() => {
                          const whatsapp = selectedContact.contacts.find(c => c.type === 'whatsapp')?.value;
                          if (whatsapp) handleQuickAction('whatsapp', whatsapp);
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                        WhatsApp
                      </Button>
                    )}
                    
                    {selectedContact.contacts.find(c => c.type === 'email') && (
                      <Button 
                        variant="outline" 
                        className={`gap-2 ${quickAction === 'email' ? 'bg-green-50 border-green-200' : ''}`}
                        onClick={() => {
                          const email = selectedContact.contacts.find(c => c.type === 'email')?.value;
                          if (email) handleQuickAction('email', email);
                        }}
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </Button>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Contact Information</h4>
                  
                  <div className="space-y-3">
                    {selectedContact.contacts.map((contact, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded">
                            {contact.icon}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{contact.label}</div>
                            <div className="text-sm text-gray-600">{contact.value}</div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(contact.value, contact.label)}
                          className="h-8 w-8 p-0"
                        >
                          Copy
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Details */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Location Details</h4>
                  
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Politeknik Negeri Batam</p>
                        <p className="text-sm text-blue-700 mt-1">
                          Jl. Ahmad Yani Batam Kota.<br />
                          Kota Batam, Kepulauan Riau, Indonesia.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>Operational Hours:</span>
                    </div>
                    <span className="font-medium">{selectedContact.operationalHours}</span>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Emergency Protocols:</span>
                  </div>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• State your name and location clearly</li>
                    <li>• Describe the situation briefly</li>
                    <li>• Follow security instructions</li>
                    <li>• Stay on the line until help arrives</li>
                  </ul>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-3 border-t pt-6">
                <Button 
                  className="w-full gap-2"
                  onClick={() => {
                    const phone = selectedContact.contacts.find(c => c.type === 'phone')?.value;
                    if (phone) handleCall(phone);
                  }}
                >
                  <Phone className="h-4 w-4" />
                  Contact Now
                </Button>
                
                <div className="text-center text-xs text-gray-500">
                  <p>Average response time: <span className="font-medium">2-5 minutes</span></p>
                </div>
              </CardFooter>
            </Card>

            {/* Campus Address Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Polibatam Campus Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">
                      Jl. Ahmad Yani Batam Kota.<br />
                      Kota Batam, Kepulauan Riau, Indonesia.
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Phone:</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 font-medium"
                      onClick={() => handleCall('+62778469858')}
                    >
                      +62-778-469858
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Fax:</span>
                    <span className="font-medium">+62-778-463620</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Email:</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 font-medium"
                      onClick={() => handleEmail('info@polibatam.ac.id')}
                    >
                      info@polibatam.ac.id
                    </Button>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2 mt-2"
                  onClick={() => {
                    const address = "Jl. Ahmad Yani Batam Kota, Kota Batam, Kepulauan Riau, Indonesia";
                    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
                    window.open(url, '_blank');
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                  Open in Google Maps
                </Button>
              </CardContent>
            </Card>

            {/* Quick Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Reference</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>Security SOP:</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    Download PDF
                  </Button>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>Security Head:</span>
                  </div>
                  <span className="font-medium">Mr. Ahmad Syafii</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span>Website:</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => window.open('https://polibatam.ac.id', '_blank')}
                  >
                    polibatam.ac.id
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-2">When to Contact Security</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Lost parking ticket or access card</li>
                    <li>• Suspicious activity in parking area</li>
                    <li>• Vehicle breakdown or lockout</li>
                    <li>• Accident or collision in parking lot</li>
                    <li>• After-hours access requests</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Printer className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-2">Documentation</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Keep a record of incident reports</li>
                    <li>• Save all communication receipts</li>
                    <li>• Note down security personnel names</li>
                    <li>• Take photos if applicable</li>
                    <li>• Follow up with email confirmation</li>
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