//買い物リスト作成
import { getAllMeals } from "../api/meals";
import { supabase } from "../utils/supabase";
import { RecipeIngredient } from "@/types";

export async function generateShoppingList(startDate: string, endDate: string) {
  //指定した日付の献立リストを取得
  const meals = await getAllMeals(startDate, endDate);

  //表示中の献立に紐づくすべてのレシピのIDを取得
  const recipeIds = meals.flatMap((meal) =>
    meal.meal_recipes.map((mr) => mr.recipe_id)
  );

  //取得したレシピに紐づく材料をすべて取得
  const { data: recipeIngredients, error } = await supabase
    .from("recipe_ingredients")
    .select(`*, ingredient:ingredients(*)`)
    .in("recipe_id", recipeIds);

  if (error) throw error;

  //辞書型の買い物リストを初期化
  const ingredientsList: Record<
    string,
    {
      ingredient_id: string;
      name: string;
      category: string;
      quantity: number;
      unit: string;
    }
  > = {};

  //取得した材料を買い物リストに追加する
  recipeIngredients.forEach((ri: RecipeIngredient) => {
    const key = ri.ingredient_id;
    if (!ingredientsList[key]) {
      ingredientsList[key] = {
        ingredient_id: ri.ingredient_id,
        name: ri.ingredient!.name,
        category: ri.ingredient!.category,
        quantity: 0,
        unit: ri.unit,
      };
    }
    ingredientsList[key].quantity += ri.quantity;
  });

  return Object.values(recipeIngredients);
}
