import { Meal, MealWithRecipes } from "@/types";
import { supabase } from "../utils/supabase";
import RecipeDetailPage from "@/app/recipe/[id]/page";

//献立一覧表示(レシピと紐づけて日付で絞り込む)
export async function getAllMeals(startDate?: string, endDate?: string) {
  let query = supabase
    .from("meals")
    .select(`*, meal_recipes(*, recipe: recipes(*))`)
    .order("date");

  //献立の日付をstartDateの日、またはそれ以降に絞る
  if (startDate) {
    query = query.gte("date", startDate);
  }

  //献立の日付をendDateの日、またはそれ以前に絞る
  if (endDate) {
    query = query.lte("date", endDate);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as MealWithRecipes[];
}


//献立新規登録(レシピとの紐づけ)
export async function createMeal(
  meal: Omit<Meal, "id" | "created_at" | "updated_at">,
  recipeIds: string[] //mealRecipeに登録するのは２つのテーブルのidのみなのでidだけ渡す
) {
  //献立を登録
  const { data: mealData, error: mealError } = await supabase
    .from("meals")
    .insert(meal)
    .select()
    .single();

  if (mealError) throw mealError;

  //登録した献立にレシピを登録
  if (recipeIds.length > 0) {
    const mealRecipes = recipeIds.map((recipeId) => ({
      meal_id: mealData.id,
      recipe_id: recipeId,
    }));

    const { error: recipesError } = await supabase
      .from("meal_recipes")
      .insert(mealRecipes);
    if (recipesError) throw recipesError;
  }
  return mealData as Meal;
}

//献立詳細表示
export async function getMealById(id: string) {
  const { data, error } = await supabase
    .from("meals")
    .select(`*, meal_recipes(*, recipe: recipes(*))`)
    .eq("id", id)
    .single();
  if (error) throw error;

  return data as MealWithRecipes;
}

//献立更新
export async function updateMeal(
  id: string,
  meal: Partial<Meal>,
  recipeIds?: string[]
) {
  const { data: mealData, error: mealError } = await supabase
    .from("meals")
    .update(meal)
    .eq("id", id)
    .select()
    .single();
  if (mealError) throw mealError;

  //レシピが渡された場合
  if (recipeIds) {
    //この献立に紐づくすべてのmealRecipesのレコードを削除
    const { error: deleteError } = await supabase
      .from("meal_recipes")
      .delete()
      .eq("recipe_id", id);

    if (deleteError) throw deleteError;

    //再度mealRecipesに新規で登録
    if (recipeIds.length > 0) {
      const mealRecipes = recipeIds.map((recipeId) => ({
        meal_id: id,
        recipe_id: recipeId,
      }));
      const { error: recipeError } = await supabase
        .from("meal_recipes")
        .insert(mealRecipes);

      if (recipeError) throw recipeError;
    }
  }
  return mealData as Meal;
}

//献立削除
export async function deleteMeal(id: string) {
  const { error } = await supabase.from("meals").delete().eq("id", id);
  if (error) throw error;
  return true;
}
