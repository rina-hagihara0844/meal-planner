import { ShoppingItem } from "@/types";
import { supabase } from "../utils/supabase";

//買い物アイテム一覧表示
export async function getAllItems(date?: string) {
  const query = supabase
    .from("shoppingitems")
    .select(`*, ingredient: ingredient(*)`);

  if (date) {
    query = query("date", date);
  }

  const { data, error } = await query();
  if (error) throw error;
  return data as ShoppingItem[];
}

//買い物アイテム詳細表示
export async function getShoppingItem(id: string) {
  const { data, error } = await supabase
    .from("shoppingItem")
    .select(`*, ingredient(*)`)
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as ShoppingItem;
}

//買い物アイテム新規登録
export async function createShoppingItem(
  shoppingItem: Omit<ShoppingItem, "id" | "created_at" | "updated_at">,
  ingredients: Ingredient[]
) {
  const { data, error } = await supabase
    .from("shopping_items")
    .insert({ shoppingItem, ingredient: ingredients })
    .select()
    .single();
  if (error) throw error;
  return data as ShoppingItem;
}

//買い物アイテム更新
export async function updateShoppingList(
  id: string,
  shoppingItem: Partial<ShoppingItem>
) {
  const { data, error } = await supabase
    .from("shopping_items")
    .update(shoppingItem)
    .select()
    .single();
  if (error) throw error;
  return data as ShoppingItem;
}

//買い物アイテム削除
export async function deleteShoppingItem(id: string) {
  const { error } = await supabase.from("shopping_items").delete().eq("id", id);
  if (error) throw error;
}
