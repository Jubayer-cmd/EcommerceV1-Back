import {
  ConditionType,
  DiscountType,
  Promotion,
  PromotionType,
  Prisma,
} from '@prisma/client';

export interface IPromotionCondition {
  conditionType: ConditionType;
  value: string;
  jsonValue?: Record<string, unknown> | null;
}

export interface ICreatePromotion {
  name: string;
  code: string;
  image?: string;
  description?: string;
  type: PromotionType;
  startDate: string | Date;
  endDate: string | Date;
  discount: number;
  discountType: DiscountType;
  maxDiscount?: number;
  usageLimit?: number;
  usageLimitPerUser?: number;
  minPurchase?: number;
  isActive?: boolean;
  conditions?: IPromotionCondition[];
  productIds?: string[];
  categoryIds?: string[];
}

export interface IUpdatePromotion extends Partial<ICreatePromotion> {}

export interface IPromotionFilters {
  active?: boolean | string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface ICartItem {
  productId: string;
  quantity: number;
  price?: number;
}

export interface IValidatePromotion {
  code: string;
  userId?: string;
  cartItems?: ICartItem[];
  cartTotal?: number;
}

export interface IPromotionUsage {
  promotionId: string;
  userId: string;
  orderId?: string;
}

export interface IPromotionConditionResponse {
  id: string;
  conditionType: ConditionType;
  value: string;
  jsonValue?: Record<string, unknown> | null;
  isActive: boolean;
  promotionId: string;
}

export interface IAppliedProductResponse {
  id: string;
  promotionId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    image?: string;
    [key: string]: any;
  };
}

export interface IAppliedCategoryResponse {
  id: string;
  promotionId: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    [key: string]: any;
  };
}

export interface IPromotionWithRelations extends Promotion {
  conditions?: IPromotionConditionResponse[];
  promotionProduct?: IAppliedProductResponse[]; // Changed from appliedProducts
  promotionCategory?: IAppliedCategoryResponse[]; // Changed from appliedCategories
  promotionUsage?: {
    // Changed from usages
    id: string;
    userId: string;
    promotionId: string;
    orderId?: string | null;
    usedAt: Date;
  }[];
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usageLimitPerUser?: number | null;
  minPurchase?: number | null;
}

export interface IPromotionResponse {
  promotion: IPromotionWithRelations;
  discountAmount: number;
  finalTotal: number;
}
