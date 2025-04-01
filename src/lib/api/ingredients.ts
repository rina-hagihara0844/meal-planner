import { supabase } from "../utils/supabase";
import { Ingredient } from "@/types";

//Ingredient一覧表示
export async function getAllIngredients() {
  const { data, error } = await supabase
    .from("ingredients")
    .select(`*`)
    .order("name");

  if (error) throw error;

  return data as Ingredient[];
}

//Ingredient詳細表示
export async function getIngredientById(id: string) {
  const { data, error } = await supabase
    .from("ingredients")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Ingredient;
}

//Ingredient新規作成
export async function createIngredient(
  ingredient: Omit<Ingredient, "id" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase
    .from("ingredients")
    .insert(ingredient)
    .select()
    .single();
  if (error) throw error;
  return data as Ingredient;
}

//Ingredient更新
export async function updateIngredient(
  id: string,
  ingredient: Partial<Ingredient>
) {
  const { data, error } = await supabase
    .from("ingredients")
    .update(ingredient)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Ingredient;
}

//Ingredient削除
export async function deleteIngredient(id: string) {
  const { error } = await supabase.from("ingredients").delete().eq("id", id);
  if (error) throw error;
  return true;
}
