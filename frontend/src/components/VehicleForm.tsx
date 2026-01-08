'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Car, Plus, X, Save, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

// Define Vehicle interface (without id for new vehicles)
export interface VehicleFormData {
  id?: string;
  license_plate: string;
  brand: string;
  model: string;
  color: string;
  type: 'car' | 'motorcycle' | 'suv' | 'truck' | 'ev';
  year: string;
  is_default: boolean;
  notes?: string;
  stnk_file?: File | null;
  stnk_status: 'pending' | 'verified' | 'rejected';
  stnk_verified_at?: string;
  stnk_rejection_reason?: string;
  created_at?: string;
}

interface VehicleFormProps {
  onClose?: () => void;
  onSave: (vehicle: Omit<VehicleFormData, 'id'>) => void;
  initialData?: Partial<VehicleFormData>;
  isEdit?: boolean;
}

const vehicleTypes = [
  { value: 'car', label: 'Car', icon: '🚗', description: 'Standard passenger car' },
  { value: 'motorcycle', label: 'Motorcycle', icon: '🏍️', description: 'Two-wheeled vehicle' },
  { value: 'suv', label: 'SUV', icon: '🚙', description: 'Sport Utility Vehicle' },
  { value: 'truck', label: 'Truck', icon: '🚚', description: 'Light or heavy truck' },
  { value: 'ev', label: 'Electric Vehicle', icon: '⚡', description: 'Electric car or motorcycle' },
];

// Valid file types for STNK
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function VehicleForm({ onClose, onSave, initialData, isEdit = false }: VehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    license_plate: initialData?.license_plate || '',
    brand: initialData?.brand || '',
    model: initialData?.model || '',
    color: initialData?.color || '',
    type: initialData?.type || 'car',
    year: initialData?.year || new Date().getFullYear().toString(),
    is_default: initialData?.is_default || false,
    notes: initialData?.notes || '',
    stnk_file: initialData?.stnk_file || null,
    stnk_status: initialData?.stnk_status || 'pending',
    stnk_verified_at: initialData?.stnk_verified_at,
    stnk_rejection_reason: initialData?.stnk_rejection_reason,
  });

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadProgress(0);

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setUploadError('Invalid file type. Please upload JPG, PNG, or PDF files.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File size too large. Maximum size is 5MB.');
      return;
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    } else {
      setFilePreview(null);
    }

    // Simulate upload progress
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 20;
      });
    }, 200);

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      setFormData(prev => ({
        ...prev,
        stnk_file: file,
        stnk_status: 'pending' as const,
        stnk_rejection_reason: undefined
      }));
      
      setTimeout(() => setUploadProgress(0), 1000);
      toast.success('STNK uploaded successfully! Verification in progress...');
    }, 1500);
  };

  const handleRemoveFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
    
    setFormData(prev => ({ 
      ...prev, 
      stnk_file: null,
      stnk_status: 'pending' as const
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.license_plate.trim()) {
      toast.error('Please enter license plate');
      return;
    }

    if (!formData.brand.trim()) {
      toast.error('Please enter vehicle brand');
      return;
    }

    if (!formData.model.trim()) {
      toast.error('Please enter vehicle model');
      return;
    }

    // Validate license plate format (Indonesia format)
    const plateRegex = /^[A-Z]{1,2}\s?\d{1,4}\s?[A-Z]{1,3}$/i;
    const cleanPlate = formData.license_plate.toUpperCase().replace(/\s+/g, ' ');
    
    if (!plateRegex.test(cleanPlate)) {
      toast.error('Please enter a valid license plate (e.g., B 1234 XYZ)');
      return;
    }

    // Check if STNK is uploaded (only for new vehicles)
    if (!isEdit && !formData.stnk_file) {
      toast.error('Please upload STNK document for verification');
      return;
    }

    setLoading(true);
    setUploadError(null);
    
    try {
      // Prepare vehicle data to save
      const vehicleToSave: Omit<VehicleFormData, 'id'> = {
        license_plate: cleanPlate,
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        color: formData.color.trim(),
        type: formData.type,
        year: formData.year,
        is_default: formData.is_default,
        notes: formData.notes?.trim(),
        stnk_file: formData.stnk_file,
        stnk_status: formData.stnk_status,
        stnk_verified_at: formData.stnk_verified_at,
        stnk_rejection_reason: formData.stnk_rejection_reason,
      };

      // In real app, you would upload the file to server here
      if (formData.stnk_file instanceof File) {
        // Simulate file upload to server
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Create FormData for multipart upload
        const formDataToSend = new FormData();
        formDataToSend.append('stnk', formData.stnk_file);
        formDataToSend.append('license_plate', cleanPlate);
        formDataToSend.append('brand', formData.brand);
        formDataToSend.append('model', formData.model);
        
        // Here you would make actual API call
        // const response = await fetch('/api/vehicles/upload-stnk', {
        //   method: 'POST',
        //   body: formDataToSend,
        // });
      }

      // Call onSave with form data
      onSave(vehicleToSave);
      
      toast.success(isEdit ? 'Vehicle updated successfully!' : 'Vehicle registered successfully!');
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast.error(`Failed to ${isEdit ? 'update' : 'register'} vehicle`);
    } finally {
      setLoading(false);
    }
  };

  const isStnkUploaded = !!formData.stnk_file;
  const isStnkVerified = formData.stnk_status === 'verified';

  return (
    <Card className="border-2 border-dashed border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          {isEdit ? 'Edit Vehicle' : 'Register New Vehicle'}
        </CardTitle>
        <CardDescription>
          Register your vehicle with STNK verification for secure parking
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* License Plate */}
          <div className="space-y-2">
            <Label htmlFor="license_plate">
              License Plate *
              <Badge variant="outline" className="ml-2 text-xs">
                Must match STNK
              </Badge>
            </Label>
            <Input
              id="license_plate"
              placeholder="B 1234 XYZ"
              value={formData.license_plate}
              onChange={(e) => setFormData({ ...formData, license_plate: e.target.value.toUpperCase() })}
              className="text-lg font-mono tracking-wider uppercase"
              maxLength={12}
            />
            <p className="text-xs text-gray-500">Enter exactly as on your STNK document</p>
          </div>

          {/* Brand & Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                placeholder="e.g., Toyota, Honda, Yamaha"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                placeholder="e.g., Camry, Civic, NMAX"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>
          </div>

          {/* Color & Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  placeholder="e.g., Red, Blue, Black"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
                <div 
                  className="w-10 h-10 rounded-md border cursor-pointer"
                  style={{ backgroundColor: formData.color.toLowerCase() }}
                  title="Current color"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select 
                value={formData.year} 
                onValueChange={(value) => setFormData({ ...formData, year: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 30 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Vehicle Type *</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: VehicleFormData['type']) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{type.icon}</span>
                      <div>
                        <span className="font-medium">{type.label}</span>
                        <p className="text-xs text-gray-500">{type.description}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* STNK Upload Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">
                STNK Document *
                {isStnkUploaded && (
                  <Badge 
                    className={`ml-2 ${
                      isStnkVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {isStnkVerified ? 'Verified' : 'Pending Verification'}
                  </Badge>
                )}
              </Label>
              {isStnkUploaded && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              )}
            </div>
            
            {!isStnkUploaded ? (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                />
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium mb-2">Upload STNK Document</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Upload clear photo or scan of your STNK
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Supported formats: JPG, PNG, PDF</p>
                  <p>• Maximum file size: 5MB</p>
                  <p>• Make sure all details are readable</p>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {formData.stnk_file instanceof File 
                            ? formData.stnk_file.name 
                            : 'STNK Document'}
                        </p>
                        {formData.stnk_file instanceof File && (
                          <p className="text-xs text-gray-500">
                            {(formData.stnk_file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                      {isStnkVerified ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    
                    {/* File Preview for Images */}
                    {filePreview && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 mb-2">Preview:</div>
                        <img 
                          src={filePreview} 
                          alt="STNK Preview" 
                          className="max-h-40 rounded border mx-auto"
                          onLoad={() => {
                            // Clean up URL when component unmounts
                            return () => {
                              if (filePreview) {
                                URL.revokeObjectURL(filePreview);
                              }
                            };
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Upload Progress */}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-3">
                        <Progress value={uploadProgress} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    )}
                    
                    {/* Verification Status */}
                    {formData.stnk_status === 'verified' && (
                      <div className="mt-2 text-sm text-green-600">
                        ✓ Verified on {new Date().toLocaleDateString()}
                      </div>
                    )}
                    
                    {formData.stnk_status === 'rejected' && formData.stnk_rejection_reason && (
                      <div className="mt-2">
                        <div className="text-sm text-red-600">
                          ✗ Rejected: {formData.stnk_rejection_reason}
                        </div>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Re-upload STNK
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {uploadError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {uploadError}
              </div>
            )}
            
            <div className="text-xs text-gray-500">
              <p className="font-medium mb-1">Why we need STNK:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Verify vehicle ownership and authenticity</li>
                <li>Ensure license plate matches registration</li>
                <li>Comply with parking facility regulations</li>
                <li>Emergency contact information</li>
              </ul>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Special features, parking preferences, etc."
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Set as Default */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_default"
              checked={formData.is_default}
              onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="is_default" className="text-sm">
              Set as default vehicle for bookings
            </Label>
          </div>

          {/* Verification Notice */}
          {!isEdit && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Verification Process</h4>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• STNK verification usually takes 1-2 business days</li>
                    <li>• You can still book parking during verification</li>
                    <li>• Unverified vehicles may have booking restrictions</li>
                    <li>• You'll receive email notification when verified</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            {onClose && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={loading || (!isEdit && !isStnkUploaded)}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                  {isEdit ? 'Updating...' : 'Registering...'}
                </>
              ) : (
                <>
                  {isEdit ? (
                    <Save className="h-4 w-4 mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {isEdit ? 'Update Vehicle' : 'Register Vehicle'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}