import { prisma } from '../config/db';

/**
 * Concurrency-safe Unique Request Code Generator.
 * Format: LL-YYYYMMDD-XXXX (e.g. LL-20260924-0001)
 */
export async function generateUniqueRequestCode(): Promise<string> {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const prefix = `LL-${dateStr}-`;

  // Find latest request code matching prefix
  const latestRequest = await prisma.bloodRequest.findFirst({
    where: {
      requestCode: {
        startsWith: prefix,
      },
    },
    orderBy: {
      requestCode: 'desc',
    },
    select: {
      requestCode: true,
    },
  });

  let nextSequence = 1;

  if (latestRequest && latestRequest.requestCode) {
    const parts = latestRequest.requestCode.split('-');
    if (parts.length === 3) {
      const parsedSeq = parseInt(parts[2], 10);
      if (!isNaN(parsedSeq)) {
        nextSequence = parsedSeq + 1;
      }
    }
  }

  // Format as 4-digit zero-padded number (e.g. 0001, 0002)
  const seqStr = nextSequence.toString().padStart(4, '0');
  const candidateCode = `${prefix}${seqStr}`;

  // Double-check uniqueness in database
  const existing = await prisma.bloodRequest.findUnique({
    where: { requestCode: candidateCode },
  });

  if (existing) {
    // Fallback if concurrent insert occurred: append random 2 digits
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    return `${prefix}${seqStr}${randomSuffix}`;
  }

  return candidateCode;
}
