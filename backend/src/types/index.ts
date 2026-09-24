import { Request } from 'express';
import { Role } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  role: Role;
  email: string;
}

export interface AuthenticatedRequest<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: JwtPayload;
}

export interface MatchFilterOptions {
  bloodGroup: string;
  city?: string;
  area?: string;
  latitude?: number;
  longitude?: number;
  maxRadiusKm?: number;
}
