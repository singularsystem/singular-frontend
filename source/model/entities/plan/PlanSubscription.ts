import { PlanType } from './PlanType';
import { SubscriptionStatus } from './SubscriptionStatus';

export interface PlanSubscription {
  id: string;
  tenantId: string;
  planType: PlanType;
  status: SubscriptionStatus;
  quotaDocuments: number;
  maxUsers: number;
  externalPaymentId?: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt?: string;
}
