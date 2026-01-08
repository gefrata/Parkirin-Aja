'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Car, Edit, Trash2, Star, Camera, QrCode, FileText, AlertCircle, CheckCircle, Clock, Plus } from 'lucide-react';
import { VehicleForm } from './VehicleForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

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

interface VehicleListProps {
  vehicles: Vehicle[];
  onVehicleUpdate?: (vehicles: Vehicle[]) => void;
}

const typeIcons = {
  car: '🚗',
  motorcycle: '🏍️',
  suv: '🚙',
  truck: '🚚',
  ev: '⚡',
};

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
  verified: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Verified' },
  rejected: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Rejected' },
};

export function VehicleList({ vehicles = [], onVehicleUpdate }: VehicleListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleList, setVehicleList] = useState<Vehicle[]>(vehicles);

  // Sync with parent when vehicles prop changes
  useState(() => {
    setVehicleList(vehicles);
  }, [vehicles]);

  const handleAddVehicle = (newVehicle: Omit<Vehicle, 'id'>) => {
    const vehicleWithId = {
      ...newVehicle,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    
    const updatedVehicles = [...vehicleList, vehicleWithId];
    setVehicleList(updatedVehicles);
    
    if (onVehicleUpdate) {
      onVehicleUpdate(updatedVehicles);
    }
    
    setShowAddForm(false);
    toast.success('Vehicle added successfully!');
  };

  const handleEditVehicle = (updatedVehicle: Vehicle) => {
    const updatedVehicles = vehicleList.map(vehicle =>
      vehicle.id === editingVehicle?.id ? { ...updatedVehicle, id: vehicle.id } : vehicle
    );
    
    setVehicleList(updatedVehicles);
    
    if (onVehicleUpdate) {
      onVehicleUpdate(updatedVehicles);
    }
    
    setEditingVehicle(null);
    toast.success('Vehicle updated successfully!');
  };

  const handleDeleteVehicle = (id: string) => {
    // Find the vehicle to check if it's default
    const vehicleToDelete = vehicleList.find(vehicle => vehicle.id === id);
    
    // Prevent deleting if it's the default vehicle and there are other vehicles
    if (vehicleToDelete?.is_default && vehicleList.length > 1) {
      toast.error('Cannot delete default vehicle. Set another vehicle as default first.');
      return;
    }
    
    // Prevent deleting if it's the only vehicle
    if (vehicleList.length === 1) {
      toast.error('You must have at least one registered vehicle');
      return;
    }
    
    const updatedVehicles = vehicleList.filter(vehicle => vehicle.id !== id);
    
    // If we deleted the default vehicle, set the first vehicle as default
    if (vehicleToDelete?.is_default && updatedVehicles.length > 0) {
      updatedVehicles[0].is_default = true;
    }
    
    setVehicleList(updatedVehicles);
    
    if (onVehicleUpdate) {
      onVehicleUpdate(updatedVehicles);
    }
    
    toast.success('Vehicle deleted successfully');
  };

  const handleSetDefault = (id: string) => {
    const updatedVehicles = vehicleList.map(vehicle => ({
      ...vehicle,
      is_default: vehicle.id === id
    }));
    
    setVehicleList(updatedVehicles);
    
    if (onVehicleUpdate) {
      onVehicleUpdate(updatedVehicles);
    }
    
    toast.success('Default vehicle updated');
  };

  return (
    <div className="space-y-6">
      {/* Vehicle List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicleList.map((vehicle) => {
          const StatusIcon = statusConfig[vehicle.stnk_status].icon;
          const statusColor = statusConfig[vehicle.stnk_status].color;
          
          return (
            <Card key={vehicle.id} className={`${vehicle.is_default ? 'border-2 border-blue-500' : ''} relative`}>
              {/* STNK Status Badge */}
              <div className="absolute -top-2 -right-2">
                <Badge className={`${statusColor} gap-1`}>
                  <StatusIcon className="h-3 w-3" />
                  {statusConfig[vehicle.stnk_status].label}
                </Badge>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-mono tracking-wider">
                      {vehicle.license_plate}
                    </CardTitle>
                    <CardDescription>
                      {vehicle.brand} {vehicle.model}
                    </CardDescription>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingVehicle(vehicle)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      disabled={vehicle.is_default && vehicleList.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {/* Vehicle Details */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{typeIcons[vehicle.type]}</span>
                      <Badge variant="outline">
                        {vehicle.type.toUpperCase()}
                      </Badge>
                    </div>
                    
                    {vehicle.is_default ? (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        <Star className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSetDefault(vehicle.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                  </div>

                  {/* Color & Year */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: vehicle.color.toLowerCase() }}
                      />
                      <span className="text-sm">{vehicle.color}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-600">Year:</span>
                      <span className="ml-1 font-medium">{vehicle.year}</span>
                    </div>
                  </div>

                  {/* STNK Status Details */}
                  {vehicle.stnk_status === 'rejected' && vehicle.stnk_rejection_reason && (
                    <div className="bg-red-50 border border-red-200 rounded p-2">
                      <p className="text-xs text-red-700">
                        <AlertCircle className="h-3 w-3 inline mr-1" />
                        {vehicle.stnk_rejection_reason}
                      </p>
                    </div>
                  )}
                  
                  {vehicle.stnk_status === 'verified' && vehicle.stnk_verified_at && (
                    <div className="bg-green-50 border border-green-200 rounded p-2">
                      <p className="text-xs text-green-700">
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                        Verified on {new Date(vehicle.stnk_verified_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {/* Notes */}
                  {vehicle.notes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600 truncate">
                        📝 {vehicle.notes}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      <QrCode className="h-4 w-4 mr-2" />
                      Show QR
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Add New Vehicle Card */}
        {vehicleList.length === 0 && (
          <Card className="border-2 border-dashed border-gray-300 flex items-center justify-center min-h-[200px]">
            <CardContent className="text-center py-8">
              <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No vehicles registered yet</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Vehicle
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Vehicle Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <VehicleForm 
            onClose={() => setShowAddForm(false)}
            onSave={handleAddVehicle}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingVehicle} onOpenChange={(open) => !open && setEditingVehicle(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {editingVehicle && (
            <VehicleForm
              isEdit
              initialData={editingVehicle}
              onClose={() => setEditingVehicle(null)}
              onSave={handleEditVehicle}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Verification Stats */}
      {vehicleList.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50">
            <CardContent className="pt-6">
              <p className="text-sm text-blue-700">Total Vehicles</p>
              <p className="text-2xl font-bold">{vehicleList.length}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50">
            <CardContent className="pt-6">
              <p className="text-sm text-green-700">Verified STNK</p>
              <p className="text-2xl font-bold">
                {vehicleList.filter(v => v.stnk_status === 'verified').length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-yellow-50">
            <CardContent className="pt-6">
              <p className="text-sm text-yellow-700">Pending Verification</p>
              <p className="text-2xl font-bold">
                {vehicleList.filter(v => v.stnk_status === 'pending').length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50">
            <CardContent className="pt-6">
              <p className="text-sm text-amber-700">Default Vehicle</p>
              <p className="text-lg font-bold truncate">
                {vehicleList.find(v => v.is_default)?.license_plate || 'Not set'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}