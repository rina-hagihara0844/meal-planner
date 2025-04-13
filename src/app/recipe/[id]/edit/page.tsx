"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Ingredient, RecipeWithIngredients } from "@/types";
import { getRecipeById, updateRecipe } from "@/lib/api/recipes";
import { getAllIngredients } from "@/lib/api/ingredients";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RecipeForm, RecipeFormData } from "@/components/recipes/RecipeForm";

export default function EditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeWithIngredients | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipeData, ingredientsData] = await Promise.all([
          getRecipeById(params.id),
          getAllIngredients(),
        ]);

        setRecipe(recipeData);
        setIngredients(ingredientsData);
      } catch (e) {
        console.error("Failed to fetch detailed recipe data:", e);
        setError("Failed to fetch detailed recipe data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const handleSubmit = async (data: RecipeFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { ingredients: recipeIngredients, ...recipeData } = data;
      await updateRecipe(params.id, recipeData, recipeIngredients);
      router.push(`/recipe/${params.id}`);
    } catch (e) {
      console.error("Failed to update recipe data:", e);
      setError("Failed to update recipe data. Try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-t-4 border-emerald-500 border-solid rounded-full animate-spin mx-auto mb-2">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">
          Failed to load the recipe.
        </h2>
        <p className="text-gray-600 mb-4">
          {error || "The recipe was not found"}
        </p>
        <Link href="/recipes">
          <Button>Back to recipe page</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <Link
            href={`/recipe/${params.id}`}
            className="text-emerald-600 hover:underline flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to recipe detail page
          </Link>
          <h1 className="text-2xl font-bold">Edit Recipe</h1>
        </div>
      </div>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>
      )}

      <Card>
        <CardContent className="p-6">
          <RecipeForm
            recipe={recipe}
            ingredients={ingredients}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
