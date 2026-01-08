'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, QrCode, Receipt, Car, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Ticket {
  id: string;
  ticket_number: string;
  vehicle_number: string;
  entry_time: string;
  status: string;
  total_amount?: number;
  total_hours?: number;
}

interface RecentTicketsProps {
  tickets: Ticket[];
}

export function RecentTickets({ tickets }: RecentTicketsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, HH:mm');
    } catch {
      return dateString;
    }
  };

  const handleViewDetails = (ticket: Ticket) => {
    toast.info(`Viewing details for ticket ${ticket.ticket_number}`);
  };

  const handleViewQR = (ticket: Ticket) => {
    toast.info(`QR Code for ticket ${ticket.ticket_number}`, {
      description: 'QR code display feature coming soon!'
    });
  };

  const handleViewReceipt = (ticket: Ticket) => {
    toast.success(`Receipt generated for ${ticket.ticket_number}`, {
      description: `Amount: $${ticket.total_amount?.toFixed(2) || '0.00'}`
    });
  };

  return (
    <div className="border rounded-xl overflow-hidden bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold">Ticket Number</TableHead>
            <TableHead className="font-semibold">Vehicle</TableHead>
            <TableHead className="font-semibold">Entry Time</TableHead>
            <TableHead className="font-semibold">Duration</TableHead>
            <TableHead className="font-semibold">Amount</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <Receipt className="h-4 w-4 mr-2 text-blue-500" />
                  {ticket.ticket_number}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Car className="h-4 w-4 mr-2 text-gray-500" />
                  {ticket.vehicle_number}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  {formatTime(ticket.entry_time)}
                </div>
              </TableCell>
              <TableCell>
                {ticket.total_hours ? (
                  <div className="font-medium">
                    {ticket.total_hours.toFixed(1)} hours
                  </div>
                ) : (
                  <span className="text-gray-400">--</span>
                )}
              </TableCell>
              <TableCell>
                {ticket.total_amount ? (
                  <div className="font-semibold text-green-600">
                    ${ticket.total_amount.toFixed(2)}
                  </div>
                ) : (
                  <span className="text-gray-400">--</span>
                )}
              </TableCell>
              <TableCell>{getStatusBadge(ticket.status)}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleViewDetails(ticket)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleViewQR(ticket)}
                    className="h-8 w-8 p-0"
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>
                  {ticket.status === 'completed' && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleViewReceipt(ticket)}
                      className="h-8 w-8 p-0"
                    >
                      <Receipt className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {tickets.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Receipt className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            You haven't created any parking tickets yet. Book your first parking spot to get started!
          </p>
          <Button>
            <Car className="mr-2 h-4 w-4" />
            Book First Parking
          </Button>
        </div>
      )}
    </div>
  );
}