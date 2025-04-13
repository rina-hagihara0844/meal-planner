import { supabase } from "@/lib/utils/supabase";
import { Recipe, RecipeWithIngredients, RecipeIngredient } from "@/types";

//レシピ一覧表示
export async function getAllRecipes() {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("name");
  if (error) throw error;
  return data as Recipe[];
}

//レシピ新規作成
export async function createRecipe(
  recipe: Omit<Recipe, "id" | "created_at" | "updated_at">,
  ingredients: Omit<
    RecipeIngredient,
    "id" | "recipe_id" | "created_at" | "updated_at"
  >[]
) {
  //レシピを登録
  const { data: recipeData, error: recipeError } = await supabase
    .from("recipes")
    .insert(recipe)
    .select()
    .single();

  if (recipeError) throw recipeError;

  //レシピIDを紐づけRecipeIngredientを登録
  if (ingredients.length > 0) {
    const recipeIngredients = ingredients.map((ingredient) => ({
      recipe_id: recipeData.id,
      ingredient_id: ingredient.ingredient_id,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
    }));

    const { error: ingredientsError } = await supabase
      .from("recipe_ingredients")
      .insert(recipeIngredients);

    if (ingredientsError) throw ingredientsError;
  }

  return recipeData as Recipe;
}

//レシピ詳細表示
export async function getRecipeById(id: string) {
  const { data, error } = await supabase
    .from("recipes")
    .select(`*, recipe_ingredients(*, ingredient:ingredients(*))`)
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as RecipeWithIngredients;
}

//レシピ更新
export async function updateRecipe(
  id: string,
  recipe: Partial<Recipe>,
  ingredients?: Omit<RecipeIngredient, "id" | "recipe_id" | "created_at">[]
) {
  //レシピを更新
  const { data: recipeData, error: recipeError } = await supabase
    .from("recipes")
    .update(recipe)
    .eq("id", id)
    .select()
    .single();

  if (recipeError) throw recipeError;

  //材料が渡された場合の処理
  if (ingredients) {
    //一度該当のレシピに紐づくrecupeIngredientのレコードをすべて削除
    const { error: deleteError } = await supabase
      .from("recipe_ingredients")
      .delete()
      .eq("recipe_id", id);

    if (deleteError) throw deleteError;

    //再度RecipeIngredientを新規登録
    if (ingredients.length > 0) {
      const recipeIngredients = ingredients.map((ingredient) => ({
        recipe_id: id,
        ingredient_id: ingredient.ingredient_id,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      }));

      const { error: ingredientsError } = await supabase
        .from("recipe_ingredients")
        .insert(recipeIngredients);

      if (ingredientsError) throw ingredientsError;
    }
  }
  return recipeData as Recipe;
}

//レシピ削除
export async function deleteRecipe(id: string) {
  const { error } = await supabase.from("recipes").delete().eq("id", id);
  if (error) throw error;
  return true;
}
