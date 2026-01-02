export const productFilterableFields: string[] = [
  'searchTerm',
  'minPrice',
  'maxPrice',
  'categoryId',
  'brandId',
  'subCategoryId',
  'unitId',
  'hasVariants',
  'option1Value',
  'option2Value',
  'option3Value',
];

export const productSearchableFields: string[] = ['name', 'description'];
export const productRelationalFields: string[] = [
  'categoryId',
  'brandId',
  'subCategoryId',
  'unitId',
];
export const productRelationalFieldsMapper: { [key: string]: string } = {
  categoryId: 'Category',
  brandId: 'brand',
  subCategoryId: 'subCategory',
  unitId: 'unit',
};
export type IProductFilterRequest = {
  searchTerm?: string | undefined;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  brandId?: string;
  subCategoryId?: string;
  unitId?: string;
  hasVariants?: boolean;
  option1Value?: string;
  option2Value?: string;
  option3Value?: string;
};

export const variantFilterableFields: string[] = [
  'sku',
  'minPrice',
  'maxPrice',
  'option1Value',
  'option2Value',
  'option3Value',
];

export const variantSearchableFields: string[] = ['sku', 'option1Value', 'option2Value', 'option3Value'];
