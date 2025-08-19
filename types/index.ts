export interface Client {
  _id?: string;
  name: string;
  email: string;
  company?: string;
  servicePlan: 'None' | 'Solo' | 'Basic' | 'Pro' | 'Elite';
  status: 'Active' | 'Paused' | 'Inactive';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}