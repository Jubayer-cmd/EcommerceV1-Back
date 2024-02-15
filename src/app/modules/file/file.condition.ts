import { file_search_condition_keys } from "./file.constant";

export interface IFileFilter {
  search?: string;
  title?: string;
  url?: string;
  asset_id?: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
}

export const GetWhereConditions = (filters: IFileFilter) => {
  const { search, ...filterData } = filters;
  const andConditions = [];

  if (search) {
    andConditions.push({
      OR: file_search_condition_keys.map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  return andConditions?.length > 0 ? { AND: andConditions } : {};
};
