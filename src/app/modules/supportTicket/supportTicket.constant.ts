export const supportTicketFilterableFields: string[] = ["searchTerm", "title"];

export const supportTicketSearchableFields: string[] = [
  'title',
  'description',
  'status',
  'ticketNumber',
];
export const supportTicketRelationalFields: string[] = ["userId"];

export const supportTicketRelationalFieldsMapper: { [key: string]: string } = {
  userId: "User",
};
export type IsupportTicketFilterRequest = {
  searchTerm?: string | undefined;
 
  title?: string | undefined;
  description?:string|undefined;
  status?:string|undefined;
  tickeNumber?:number|undefined
};
