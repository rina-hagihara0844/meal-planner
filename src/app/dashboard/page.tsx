import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { getAllMeals } from "@/lib/api/meals";
import { getAllRecipes } from "@/lib/api/recipes";
import { getAllShoppingItems } from "@/lib/api/shopping-items";
import Link from "next/link";

export default async function DashboardPage() {
  const today = new Date();
  const strToday = today.toISOString().split("T")[0];
  //本日の日付を日本時間にする
  const formattedDate = new Intl.DateTimeFormat("en-EN", {
    dateStyle: "full",
  }).format(today);

  //1週間後までの日付を生成
  const oneWeekLater = new Date(today);
  oneWeekLater.setDate(oneWeekLater.getDate() + 7);
  const strOneWeekLater = oneWeekLater.toISOString().split("T")[0];

  try {
    //1週間分の献立を取得
    const meals = await getAllMeals(strToday, strOneWeekLater);
    //全てのレシピを取得
    const recipes = await getAllRecipes();
    //未購入のアイテムのみ取得
    const shoppingItems = await getAllShoppingItems(false);

    //本日の献立を取得
    const todaysMeals = meals.filter(
      (meal) => meal.date.split("T")[0] === strToday
    );

    //食事タイプごとにグループ
    const mealsByType = {
      breakfast: todaysMeals.find((meal) => meal.meal_type === "breakfast"),
      lunch: todaysMeals.find((meal) => meal.meal_type === "lunch"),
      dinner: todaysMeals.find((meal) => meal.meal_type === "dinner"),
    };

    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Hi, Welcome to Meal Planner</h1>
          <p className="text-gray-600">
            Plan and manage Meal to streamline your shopping.
          </p>
        </header>

        {/*メインコンテンツ*/}
        <div className="md:col-span-2">
          <Card className="bg-emerald-50 border-emerald-100">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Todays Meal</h2>
                <div className="text-sm text-gray-500">{formattedDate}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {["breakfast", "lunch", "dinner"].map((mealType) => {
                  const meal =
                    mealsByType[mealType as keyof typeof mealsByType];
                  return (
                    <div
                      key={mealType}
                      className="bg-white rounded-lg p-4 shadow-sm"
                    >
                      <h3 className="font-medium mb-2">{mealType}</h3>
                      {meal ? (
                        <div>
                          <ul className="space-y-2">
                            {meal.meal_recipes.map((mr) => (
                              <li key={mr.id} className="text-sm">
                                {mr.recipe.name}
                              </li>
                            ))}
                          </ul>
                          <Link
                            href={`meals/${meal.id}`}
                            className="text-xs text-emerald-600 hover:underline mt-2 inline-block"
                          >
                            See in detail
                          </Link>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500 mb-2">
                            meal is not setted.
                          </p>
                          <Link
                            href="/meals"
                            className="text-emerald-600 hover:underline text-sm"
                          >
                            Add meal
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/*買い物リスト*/}
        <div>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Shopping List</h2>
                <Link href="/shopping">
                  <Button variant="outline" size="sm">
                    See All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {shoppingItems.length > 0 ? (
                <div>
                  {shoppingItems.slice(0, 5).map((item) => (
                    <div key={item.id}>
                      <span>{item.ingredient.name}</span>
                      <span className="text-sm text-gray-500">
                        {item.quantity} {item.ingredient.unit}
                      </span>
                    </div>
                  ))}
                  {shoppingItems.length > 5 && (
                    <div className="text-center pt-2">
                      <Link
                        href="/shopping"
                        className="text-sm text-emerald-600 hover:underline"
                      >
                        See other {shoppingItems.length - 5} items
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500 mb-2">
                    shopping itsm is empty.
                  </p>
                  <Link
                    href="/shopping/add"
                    className="text-emerald-600 hover:underline text-sm"
                  >
                    Add Items
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Dashboard data loading error:", error);
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">failed to read data</h2>
        <p className="text-gray-600">Please reload page or wait for while.</p>
      </div>
    );
  }
}
