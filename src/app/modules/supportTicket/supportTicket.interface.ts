export const supportTicketFilterableFields: string[] = ['status'];

export const supportTicketSearchableFields: string[] = ['title'];
export const supportTicketRelationalFields: string[] = ['userId'];
export const supportTicketRelationalFieldsMapper: { [key: string]: string } = {
  userId: 'user',
};
export type IsupportTicketFilterRequest = {
  status?: string;
};
