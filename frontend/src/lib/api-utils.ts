import { toast } from 'sonner';
import api from './axios';

export const handleApiCall = async <T>(
  promise: Promise<T>,
  options?: {
    loadingMessage?: string;
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
  }
): Promise<T | null> => {
  const {
    loadingMessage = 'Processing...',
    successMessage = 'Operation successful',
    errorMessage = 'Operation failed',
    onSuccess,
    onError
  } = options || {};

  let toastId: string | number | undefined;
  
  if (loadingMessage) {
    toastId = toast.loading(loadingMessage);
  }

  try {
    const data = await promise;
    
    if (toastId) {
      toast.dismiss(toastId);
    }
    
    if (successMessage) {
      toast.success(successMessage);
    }
    
    if (onSuccess) {
      onSuccess(data);
    }
    
    return data;
  } catch (error) {
    if (toastId) {
      toast.dismiss(toastId);
    }
    
    toast.error(errorMessage);
    console.error('API Error:', error);
    
    if (onError) {
      onError(error);
    }
    
    return null;
  }
};

// Contoh penggunaan di komponen
export const parkingApi = {
  async bookParking(data: any) {
    return handleApiCall(
      api.post('/bookings/', data),
      {
        loadingMessage: 'Booking parking slot...',
        successMessage: 'Parking booked successfully!',
        errorMessage: 'Failed to book parking'
      }
    );
  },
  
  async createTicket(data: any) {
    return handleApiCall(
      api.post('/tickets/', data),
      {
        loadingMessage: 'Creating ticket...',
        successMessage: 'Ticket created successfully!',
        errorMessage: 'Failed to create ticket'
      }
    );
  },
  
  async checkOutTicket(ticketId: string) {
    return handleApiCall(
      api.post(`/tickets/${ticketId}/check_out/`),
      {
        loadingMessage: 'Processing checkout...',
        successMessage: 'Checkout completed!',
        errorMessage: 'Checkout failed'
      }
    );
  }
};