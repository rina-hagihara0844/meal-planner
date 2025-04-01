import { ShoppingItem, Ingredient } from "@/types";
import { supabase } from "../utils/supabase";

//買い物アイテム一覧表示
export async function getAllShoppingItems(isPurchased?: boolean) {
  let query = supabase
    .from("shopping_items")
    .select(`*, ingredient: ingredients(*)`);

  if (isPurchased !== undefined) {
    query = query.eq("is_purchased", isPurchased);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as (ShoppingItem & { ingredient: Ingredient })[];
}

//買い物アイテム新規登録
export async function createShoppingItem(
  item: Omit<ShoppingItem, "id" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase
    .from("shopping_items")
    .insert(item)
    .select(`*, ingredient:ingredients(*)`)
    .single();
  if (error) throw error;
  return data as ShoppingItem & { ingredient: Ingredient };
}

//買い物アイテム更新
export async function updateShoppingList(
  id: string,
  item: Partial<ShoppingItem>
) {
  const { data, error } = await supabase
    .from("shopping_items")
    .update(item)
    .eq("id", id)
    .select(`*, ingredient: ingredients(*)`)
    .single();
  if (error) throw error;
  return data as ShoppingItem & { ingredient: Ingredient };
}

//買い物アイテム削除
export async function deleteShoppingItem(id: string) {
  const { error } = await supabase.from("shopping_items").delete().eq("id", id);
  if (error) throw error;
  return true;
}
