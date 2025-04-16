'use client'
import { getAllRecipes } from "@/lib/api/recipes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Recipe, RecipeWithIngredients } from "@/types";

export default function RecipesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState<RecipeWithIngredients[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeWithIngredients[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState("all"); //後で型指定

  // カテゴリーの並び順を定義
  const categoryOrder = ["main", "side", "soup", "breakfast", "other"];

  useEffect(() => {
    const fetchData = async () => {
      try{
        setIsLoading(true);
        const data = await getAllRecipes();
        setRecipes(data);
        setFilteredRecipes(data);
        setError(null);
      } catch(e) {
        console.error("failed to load recipes data.", e);
        setError("failed to load recipes data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

    //レシピをカテゴリ毎に分ける
    const groupRecipesByCategory = (recipes: RecipeWithIngredients[]) => {
      const recipesByCategory = recipes.reduce<Record<string, typeof recipes>>(
        (acc, recipe) => {
          const category = recipe.category || "other";
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(recipe);
          return acc;
        },
        {}
      );
      
      //categoryOrderの順番にrecipeByCategoryを並び替える
      const sortedCategories = Object.keys(recipesByCategory).sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);

      //a、bどちらもcategoryOrderに存在しない場合直接比較
      if (indexA == -1 && indexB == -1) return a.localeCompare(b);
      //aのみcategoryOrderに存在しない場合aは後
      if (indexA == -1) return 1;
      //bのみcategoryOrderに存在しない場合aは前
      if (indexB == -1) return -1;

      //両方存在する場合
      return indexA - indexB;
    });

    return {recipesByCategory,sortedCategories};
    };

    // 検索条件が変更されたときにレシピをフィルタリング
    useEffect(() => {
      if (recipes.length === 0) return;
      let result = [...recipes];

      //検索された文字列でフィルタリング
      if(searchTerm) {
        const term = searchTerm;
        result = result.filter(recipe => recipe.name.includes(term));
      }

      // カテゴリでフィルタリング
      if(selectedCategory && selectedCategory !== "all"){
        result = result.filter(recipe => 
          recipe.category === selectedCategory);
      }

      setFilteredRecipes(result);
    }, [selectedCategory, searchTerm, recipes]);

      // グループ化されたレシピデータ
    const {recipesByCategory, sortedCategories } = 
    groupRecipesByCategory(filteredRecipes);

  // 検索入力が変更された時の処理
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

    // カテゴリ選択が変更された時の処理
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Loading recipes...</h2>
      </div>
    );
  }

    if(error){
      return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">{error}</h2>
          <p className="text-gray-600">
            Please reload the page or try again later.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Recipe List</h1>
          <Link href="/recipe/new">
            <Button variant="primary">Add Recipe</Button>
          </Link>
        </div>
        {/*検索・フィルターエリア*/}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <div className="absolute left-3 top-2 text-gray-400">
                    <Search />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="all" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">all</SelectItem>
                    {sortedCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        {sortedCategories.map((category) => {
          const categoryRecipes = recipesByCategory[category];
          return (
            <div key={category} className="space-y-4">
              <h2 className="text-xl font-semibold">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {categoryRecipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    href={`/recipe/${recipe.id}`}
                    className="block h-full"
                  >
                    <Card className="h-full transition-shadow hover:shadow-md">
                      <div className="relative h-40 w-full overflow-hidden">
                        <Image
                          src={
                            recipe.image_url || "/images/recipe-placeholder.png"
                          }
                          alt={recipe.name}
                          fill
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-lg mb-1 truncate">
                          {recipe.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {recipe.serving_size} servings
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
        {recipes.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">There are no recipes.</h2>
            <p className="text-gray-600 mb-4">
              Lets add your first recipe and start planning your meals!
            </p>
            <Link href="/recipe/new">
              <Button variant="primary">Add Recipe</Button>
            </Link>
          </div>
        )}
      </div>
    );
}
