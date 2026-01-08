'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Car, DollarSign, Star, Zap, Accessibility } from 'lucide-react'; // Ganti Wheelchair dengan Accessibility
import Link from 'next/link';
import { toast } from 'sonner';

interface ParkingLotCardProps {
  lot: {
    id: string;
    name: string;
    location: string;
    available_slots: number;
    total_slots: number;
    price_per_hour: number;
    available_count?: number;
  };
}

export function ParkingLotCard({ lot }: ParkingLotCardProps) {
  const availabilityPercentage = ((lot.available_count || lot.available_slots) / lot.total_slots) * 100;
  
  const getAvailabilityColor = (percentage: number) => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAvailabilityText = (percentage: number) => {
    if (percentage > 50) return 'Good';
    if (percentage > 20) return 'Limited';
    return 'Full';
  };

  const handleQuickBook = () => {
    toast.success(`Quick booking started for ${lot.name}`, {
      description: 'Redirecting to booking form...'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{lot.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="text-sm">{lot.location}</span>
            </CardDescription>
          </div>
          <Badge 
            variant={availabilityPercentage > 20 ? "default" : "destructive"}
            className="ml-2"
          >
            {getAvailabilityText(availabilityPercentage)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Availability Bar */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Availability</span>
            <span className="font-semibold">
              {lot.available_count || lot.available_slots}/{lot.total_slots} slots
            </span>
          </div>
          <Progress 
            value={availabilityPercentage} 
            className="h-2"
          />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-100 rounded-md">
              <DollarSign className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500">Rate</p>
              <p className="font-semibold">${lot.price_per_hour}/hour</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-green-100 rounded-md">
              <Car className="h-3.5 w-3.5 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500">Type</p>
              <p className="font-semibold">Multi-level</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500 mb-2">Available Features:</p>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              <Star className="h-3 w-3 mr-1" /> VIP
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Zap className="h-3 w-3 mr-1" /> EV
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Accessibility className="h-3 w-3 mr-1" /> Disabled
            </Badge>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-3">
        <Link href={`/parking/${lot.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
        <Button 
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          onClick={handleQuickBook}
          disabled={availabilityPercentage <= 0}
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}