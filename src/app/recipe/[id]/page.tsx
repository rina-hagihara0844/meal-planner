import { getRecipeById } from "@/lib/api/recipes";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default async function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const recipe = await getRecipeById(params.id);
    //説明部分を行ごとに分割する
    const instructionSteps = recipe.instructions
      .split("\n")
      .filter((step) => step.trim() !== "");

    return (
      <div className="space-y-6">
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <Link
              href="/recipe"
              className="text-emerald-600 hover:underline flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Recipe List page.
            </Link>
            <h1 className="text-2xl font-bold">{recipe.name}</h1>
          </div>

          <div className="flex gap-2">
            <Link href={`/recipe/${recipe.id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
            <Button>Add to Meal</Button>
          </div>
        </div>

        {/* メインコンテンツ部分 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <div className="w-full h-64 md:h-96 relative">
                <Image
                  src={recipe.image_url || "/images/recipe-placeholder.png"}
                  alt={recipe.name}
                  fill
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge>{recipe.category}</Badge>
                  <Badge>{recipe.serving_size} servings</Badge>
                  {recipe.country_of_origin && (
                    <Badge>{recipe.country_of_origin}</Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-6">{recipe.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Ingredient</h2>
                    <ul className="space-y-2">
                      {recipe.recipe_ingredients.map((item) => (
                        <li
                          key={item.id}
                          className="flex justify-between border-b pb-2"
                        >
                          <span>{item.ingredient.name}</span>
                          <span>
                            {item.quantity}
                            {item.unit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-3">作り方</h2>
                    <ol className="space-y-4">
                      {instructionSteps.map((step, index) => (
                        <li key={index} className="flex">
                          <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mr-3 font-medium">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-1">
            {/* サイドバーエリア 必要に応じてコンテンツを追加 */}
            <Button className="w-full">Add to meal</Button>
          </div>
        </div>
      </div>
    );
  } catch (e) {
    console.error("Recipe detail loading error:", e);
    return notFound();
  }
}
