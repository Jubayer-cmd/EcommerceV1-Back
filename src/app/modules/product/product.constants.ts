export const productFilterableFields: string[] = [
  'searchTerm',
  'minPrice',
  'maxPrice',
  'category',
  'brand',
  'subCategory',
  'unit',
  'hasVariants',
  'attributeValue',
];

export const productSearchableFields: string[] = ['name', 'description'];
export const productRelationalFields: string[] = [
  'categoryId',
  'brandId',
  'subCategoryId',
  'unitId',
];
export const productRelationalFieldsMapper: { [key: string]: string } = {
  categoryId: 'category',
  brandId: 'brand',
  subCategoryId: 'subCategory',
  unitId: 'unit',
};
export type IProductFilterRequest = {
  searchTerm?: string | undefined;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  brand?: string;
  subCategory?: string;
  unit?: string;
  hasVariants?: boolean;
  attributeValue?: string;
};

export const variantFilterableFields: string[] = [
  'sku',
  'minPrice',
  'maxPrice',
  'attributeValue',
];

export const variantSearchableFields: string[] = ['sku'];
