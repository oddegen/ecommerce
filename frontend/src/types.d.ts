export type Categories = "Men" | "Women" | "Kids";
export type SubCategories = "Topwear" | "Bottomwear" | "Winterwear";

export type SortOptions = "relevant" | "low-high" | "high-low";
export type SizeOptions = "S" | "M" | "L" | "XL" | "XXL";

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string[];
  category: Categories;
  subCategory: SubCategories;
  sizes: SizeOptions[];
  date: number;
  bestseller: boolean;
}
