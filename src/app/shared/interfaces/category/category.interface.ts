export interface Category {
  id: string;
  name: string;
  imageUrl?: string | null;
  isDefault: boolean;
  isIncome?: boolean | null;
  parentId?: string | null;
  subcategories: Category[];
}
