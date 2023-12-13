export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role?: Role;
  contactNo: string;
  address: string;
  profileImg: string;
};

enum Role {
  admin = "admin",
  user = "user",
  superAdmin = "superAdmin",
}

export const userFilterableFields: string[] = ["searchTerm", "email", "role"];
export const userSearchableFields: string[] = ["name", "email"];
export type IUserFilterRequest = {
  searchTerm?: string | undefined;
  email?: string | undefined;
  role?: Role | undefined;
};
