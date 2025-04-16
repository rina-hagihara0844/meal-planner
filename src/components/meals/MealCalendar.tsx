import { MealWithRecipes } from "@/types";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface MealCalendarProps {
  meals: MealWithRecipes[];
  currentDate: Date;
  onAddMeal: (date: Date, mealType: string) => void;
  onViewMealDetails: (mealId: string) => void;
}

export const MealCalendar: React.FC<MealCalendarProps> = ({
  meals,
  currentDate,
  onAddMeal,
  onViewMealDetails,
}) => {
  //現在の日付の週の日曜日にセット
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d;
  };

  //1週間分作成
  const startOfWeek = getStartOfWeek(currentDate);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    return date;
  });

  //表示のために日付をフォーマット化
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ja-JP", {
      weekday: "short",
      day: "numeric",
    }).format(date);
  };

  //日付が本日かを確認
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  //指定した日付の、献立タイプの献立を取得
  const getMealsForDateAndType = (date: Date, mealType: string) => {
    const dateString = date.toISOString().split("T")[0];
    return meals.filter(
      (meal) =>
        meal.date.split("T")[0] === dateString && meal.meal_type === mealType
    );
  };

  const mealTypes = ["breakfast", "lunch", "dinner"];
  const mealTypeLabels = {
    breakfast: "breakfast",
    lunch: "lunch",
    dinner: "dinner",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Meal for{" "}
          {new Intl.DateTimeFormat("ja-JP", { month: "long" }).format(
            currentDate
          )}
        </h2>
        <div className="flex gap-2">
          <Button variant="secondary">Last Week</Button>
          <Button variant="primary">This Week</Button>
          <Button variant="secondary">Next Week</Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDates.map((date) => (
          <div key={date.toISOString()} className="text-center">
            <div
              className={`py-2 rounded-t-lg font-medium ${
                isToday(date)
                  ? "bg-emerald-500 text-white"
                  : date.getDay() === 0 || date.getDay() === 6
                  ? "bg-red-100"
                  : "bg-gray-100"
              } `}
            >
              {formatDate(date)}
            </div>
          </div>
        ))}
      </div>

      {mealTypes.map((mealType) => (
        <div key={mealType}>
          <h3 className="text-xl font-semibold mb-3">
            {mealTypeLabels[mealType as keyof typeof mealTypeLabels]}
          </h3>
          <div className="grid grid-cols-7 gap-4">
            {weekDates.map((date) => {
              const mealsForDate = getMealsForDateAndType(date, mealType);

              return (
                <Card
                  key={`${date.toISOString()}-${mealType}`}
                  className="h-full"
                  onClick={() => {
                    if (mealsForDate.length > 0) {
                      onViewMealDetails(mealsForDate[0].id);
                    } else {
                      onAddMeal(date, mealType);
                    }
                  }}
                >
                  <CardContent className="p-3">
                    {mealsForDate.length > 0 ? (
                      <div>
                        {mealsForDate.map((meal) => (
                          <div
                            key={meal.id}
                            className="mb-2 cursor-pointer hover:text-emerald-600"
                          >
                            {meal.meal_recipes.map((mr) => (
                              <div key={mr.id} className="text-sm mb-1">
                                {mr.recipe.name}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        className="h-full min-h-16 flex items-center justify-center border-2 border-dashed bprder-gray-200 rounded-lg p-2 cursor-pointer hover:border-emerald-300 transition-colors"
                      >
                        <span className="text-sm text-gray-500">+</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
