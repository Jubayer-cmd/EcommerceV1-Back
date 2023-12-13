export const serviceFilterableFields: string[] = [
  "search",
  "minPrice",
  "maxPrice",
  "category",
];

export const serviceSearchableFields: string[] = ["title", "author", "genre"];
export const serviceRelationalFields: string[] = ["categoryId"];
export const serviceRelationalFieldsMapper: { [key: string]: string } = {
  categoryId: "category",
};
export type IServiceFilterRequest = {
  search?: string | undefined;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
};
