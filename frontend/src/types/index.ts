export type UserRole = 'DONOR' | 'REQUESTER' | 'HOSPITAL' | 'BLOOD_BANK' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type Urgency = 'NORMAL' | 'URGENT' | 'EMERGENCY';

export type RequestStatus =
  | 'OPEN'
  | 'MATCHING'
  | 'RESPONSES_RECEIVED'
  | 'DONOR_CONFIRMED'
  | 'PARTIALLY_FULFILLED'
  | 'FULFILLED'
  | 'CANCELLED'
  | 'EXPIRED';

export type ResponseStatus = 'ACCEPTED' | 'DECLINED' | 'MAYBE' | 'WITHDRAWN';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  donorProfile?: DonorProfile;
  hospitalProfile?: HospitalProfile;
  bloodBankProfile?: BloodBankProfile;
}

export interface DonorProfile {
  id: string;
  userId: string;
  bloodGroup: BloodGroup;
  city: string;
  area: string;
  postalCode: string;
  isAvailable: boolean;
  verificationStatus: VerificationStatus;
  lastDonationDate?: string;
}

export interface HospitalProfile {
  id: string;
  userId: string;
  hospitalName: string;
  address: string;
  city: string;
  area: string;
  postalCode: string;
  verificationStatus: VerificationStatus;
}

export interface BloodBankProfile {
  id: string;
  userId: string;
  bankName: string;
  address: string;
  city: string;
  area: string;
  postalCode: string;
  verificationStatus: VerificationStatus;
}

export interface BloodRequest {
  id: string;
  requestCode?: string | null;
  requesterId: string;
  hospitalId?: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  urgency: Urgency;
  city: string;
  area: string;
  postalCode: string;
  requiredDateTime: string;
  reason?: string;
  status: RequestStatus;
  createdAt: string;
  requester?: { id: string; name: string; phone: string; email: string };
  hospital?: HospitalProfile;
  donorResponses?: DonorResponse[];
  hasResponded?: boolean;
  donorResponse?: DonorResponse;
}

export interface DonorResponse {
  id: string;
  bloodRequestId: string;
  donorId: string;
  responseStatus: ResponseStatus;
  previousStatus?: ResponseStatus;
  withdrawalReason?: string;
  respondedAt: string;
  notes?: string;
  donor?: {
    userId?: string;
    user?: { name: string; phone: string };
    bloodGroup?: BloodGroup;
  };
}

export interface BloodInventoryItem {
  id: string;
  bloodBankId: string;
  bloodGroup: BloodGroup;
  unitsAvailable: number;
  location: string;
  lastUpdated: string;
  status: 'AVAILABLE' | 'LOW' | 'OUT_OF_STOCK' | 'EXPIRED';
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeDonors: number;
  openRequests: number;
  emergencyRequests: number;
  verifiedHospitals: number;
  verifiedBloodBanks: number;
  fulfilledRequests: number;
}
