"use client";
import { getAllMeals, getMealById, createMeal, deleteMeal; } from "@/lib/api/meals";
import { useState, useEffect } from "react";
import { MealWithRecipes, Recipe } from "@/types";
import { getAllRecipes } from "@/lib/api/recipes";

export default function MealsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meals, setMeals] = useState<MealWithRecipes[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<MealWithRecipes>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMealDetailModalOpen, setIsMealDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //献立データと食材データを取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 表示する週の開始日と終了日を計算
        const startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - startDate.getDay()); //日曜に設定

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6); //土曜日に設定

        const startDateStr = startDate.toISOString().split("T")[0];
        const endDateStr = endDate.toISOString().split("T")[0];

        //データを平行して取得
        const [mealsData, recipesData] = await Promise.all([
          getAllMeals(startDateStr, endDateStr),
          getAllRecipes(),
        ]);

        setMeals(mealsData);
        setRecipes(recipesData);
        setError(null);
      } catch (e) {
        console.error("failed to fetch meal data", e);
        setError("failed to fetch meal data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentDate]);

  //献立追加モーダルを開く
  const handleAddMeal = (date: Date, mealType: string) => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setIsAddModalOpen(true);
  };

  //献立詳細モーダルを開く
  const handleViewMealDetails = async (mealId: string) => {
    try {
      const meal = meals.find((m) => m.id === mealId);
      if (meal) {
        setSelectedMeal(meal);
        setIsMealDetailModalOpen(true);
      }
    } catch (e) {
      console.error("Failed to get meal details:", e);
      setError("Failed to get meal details");
    }
  };

  //献立を追加
  const handleAddMealSubmit = async (
    date: Date,
    mealType: "breakfast" | "lunch" | "dinner",
    recipeIds: string[]
  ) => {
    try {
      const formattedDate = date.toISOString().split("T")[0];
      //献立を登録
      const newMeal = await createMeal(
        {
          date: formattedDate,
          meal_type: mealType,
        },
        recipeIds
      );

      //画面に登録されている献立を更新
      const updatedMeal = {
        ...newMeal,
        meal_recipes: recipeIds.map((recipeId) => ({
          id: "",
          meal_id: newMeal.id,
          recipe_id: recipeId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          recipe: recipes.find((r) => r.id === recipeId)!,
        })),
      };

      setMeals((prevMeals) => [...prevMeals, updatedMeal as any]);
      setIsAddModalOpen(false);
      setError(null);
    } catch (e) {
      console.error("Failed to add meal:", e);
      setError("Failed to add meal");
    }
  };

  //献立を編集
  const handleEditMeal = () => {
    if (!selectedMeal) return;
    // 編集ページに遷移またはモーダルを開く(後ほど実装)
    // 実際の実装ではここに編集ロジックを追加
    setIsMealDetailModalOpen(false);
  };

  //献立を削除
  const handleDeleteMeal = async () => {
    if(!selectedMeal) return;

    try{
    await deleteMeal(selectedMeal.id);  
    setMeals(prevMeals => prevMeals.filter(meal => meal.id !== selectedMeal.id));
    setIsMealDetailModalOpen(false);
    setError(null);
    } catch(e) {
    console.error('Failed to delete meal:', e);
    setError('Failed to delete meal');
  }
};

//買い物リストに追加
const handleAddToShoppingList = ()=> {
    if(!selectedMeal) return;
    // 後ほどここに買い物リスト追加ロジックを追加
    setIsMealDetailModalOpen(false);
}

if(isLoading){
    return (
        <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-t-4 border-emerald-500 border-solid rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
}

return(
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Meal Management</h1>
        </div>

        {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg">
            {error}
        </div>
        )}

        <MealCalendar
        meals={meals}
        currentDate={currentDate}
        onAddMeal={handleAddMeal}
        onViewMealDetails={handleViewMealDetails};
        />

        {/* 献立追加モーダル */}
        <AddMealModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        recipes={recipes}
        selectedDate={selectedDate}
        selectedMealType={selectedMealType}
        onAddMeal={handleAddMealSubmit}
        />

         {/* 献立詳細モーダル */}
         <MealDetailModal 
         isOpen={isMealDetailModalOpen}
         onClose={() => setIsMealDetailModalOpen(false)}
         meal={selectedMeal}
         onEdit={handleEditMeal}
         onDelete={handleDeleteMeal}
         onAddToShoppingList={handleAddToShoppingList}
         />
    </div>
)
}