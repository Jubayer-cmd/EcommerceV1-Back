export const productFilterableFields: string[] = [
  "searchTerm",
  "minPrice",
  "maxPrice",
  "category",
];

export const productSearchableFields: string[] = ["name", "description"];
export const productRelationalFields: string[] = ["categoryId"];
export const productRelationalFieldsMapper: { [key: string]: string } = {
  categoryId: "category",
};
export type IProductFilterRequest = {
  searchTerm?: string | undefined;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
};
