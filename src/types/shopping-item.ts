import { Ingredient } from "./ingredient";

export interface ShoppingItem {
  id: string;
  ingredient_id: string;
  quantity: number;
  is_purchased: boolean;
  purchased_date: string | null;
  created_at: string;
  updated_at: string;
  ingredient?: Ingredient;
}

export interface ShoppingWithIngredient extends ShoppingItem{
  ingredient: Ingredient;
}
