export interface Category {
  id: string;
  name: string;
  imageUrl: string | null;
  subcategories: Category[];
}
