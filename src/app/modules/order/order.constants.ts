export const orderFilterableFields: string[] = [
  "searchTerm",
  "status",
  "userId",
  // Add more filter fields as needed
];

export const orderSearchableFields: string[] = [
  "status",
  "firstName",
  "lastName",
];
export const orderRelationalFields: string[] = ["userId"];
export const orderRelationalFieldsMapper: { [key: string]: string } = {
  userId: "user",
};

export type IOrderFilterRequest = {
  searchTerm?: string | undefined;
  status?: string | undefined;
  userId?: string | undefined;
  // Add more filter fields as needed
};
