import { BloodGroup } from '@prisma/client';

/**
 * Isolated Blood Group Compatibility Engine.
 * Note: Wording must always state potential compatibility based on recorded blood group.
 * Final medical eligibility must always be confirmed by medical professionals.
 */

// Mapping of Recipient Blood Group -> Compatible Donor Blood Groups
const COMPATIBLE_DONOR_MAP: Record<string, BloodGroup[]> = {
  'O-': [BloodGroup.O_NEGATIVE],
  'O+': [BloodGroup.O_NEGATIVE, BloodGroup.O_POSITIVE],
  'A-': [BloodGroup.O_NEGATIVE, BloodGroup.A_NEGATIVE],
  'A+': [BloodGroup.O_NEGATIVE, BloodGroup.O_POSITIVE, BloodGroup.A_NEGATIVE, BloodGroup.A_POSITIVE],
  'B-': [BloodGroup.O_NEGATIVE, BloodGroup.B_NEGATIVE],
  'B+': [BloodGroup.O_NEGATIVE, BloodGroup.O_POSITIVE, BloodGroup.B_NEGATIVE, BloodGroup.B_POSITIVE],
  'AB-': [BloodGroup.O_NEGATIVE, BloodGroup.A_NEGATIVE, BloodGroup.B_NEGATIVE, BloodGroup.AB_NEGATIVE],
  'AB+': [
    BloodGroup.O_NEGATIVE,
    BloodGroup.O_POSITIVE,
    BloodGroup.A_NEGATIVE,
    BloodGroup.A_POSITIVE,
    BloodGroup.B_NEGATIVE,
    BloodGroup.B_POSITIVE,
    BloodGroup.AB_NEGATIVE,
    BloodGroup.AB_POSITIVE,
  ],
};

/**
 * Get all compatible donor blood groups for a given recipient blood group string or enum.
 */
export function getCompatibleDonorBloodGroups(recipientBloodGroup: string): BloodGroup[] {
  const normalized = normalizeBloodGroupString(recipientBloodGroup);
  return COMPATIBLE_DONOR_MAP[normalized] || [];
}

/**
 * Check if a donor blood group is potentially compatible with a recipient blood group.
 */
export function isBloodCompatible(donorBloodGroup: string, recipientBloodGroup: string): boolean {
  const compatibleDonors = getCompatibleDonorBloodGroups(recipientBloodGroup);
  const normalizedDonor = mapStringToEnum(donorBloodGroup);
  return compatibleDonors.includes(normalizedDonor);
}

/**
 * Helper to normalize blood group strings (e.g. "O_POSITIVE" or "O+" -> "O+")
 */
export function normalizeBloodGroupString(bg: string): string {
  switch (bg) {
    case 'O_POSITIVE':
    case 'O+':
      return 'O+';
    case 'O_NEGATIVE':
    case 'O-':
      return 'O-';
    case 'A_POSITIVE':
    case 'A+':
      return 'A+';
    case 'A_NEGATIVE':
    case 'A-':
      return 'A-';
    case 'B_POSITIVE':
    case 'B+':
      return 'B+';
    case 'B_NEGATIVE':
    case 'B-':
      return 'B-';
    case 'AB_POSITIVE':
    case 'AB+':
      return 'AB+';
    case 'AB_NEGATIVE':
    case 'AB-':
      return 'AB-';
    default:
      return bg;
  }
}

export function mapStringToEnum(bg: string): BloodGroup {
  const norm = normalizeBloodGroupString(bg);
  switch (norm) {
    case 'O+':
      return BloodGroup.O_POSITIVE;
    case 'O-':
      return BloodGroup.O_NEGATIVE;
    case 'A+':
      return BloodGroup.A_POSITIVE;
    case 'A-':
      return BloodGroup.A_NEGATIVE;
    case 'B+':
      return BloodGroup.B_POSITIVE;
    case 'B-':
      return BloodGroup.B_NEGATIVE;
    case 'AB+':
      return BloodGroup.AB_POSITIVE;
    case 'AB-':
      return BloodGroup.AB_NEGATIVE;
    default:
      return BloodGroup.O_POSITIVE;
  }
}

export const COMPATIBILITY_MEDICAL_DISCLAIMER =
  'Potentially compatible based on your registered blood group. Final eligibility must be confirmed by medical professionals.';
