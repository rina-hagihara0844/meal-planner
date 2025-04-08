import { getAllRecipes } from "@/lib/api/recipes"
import { Recipe } from "@/types";
import { ReceiptJapaneseYen } from "lucide-react";

export default async function ReciesPage(){
    try{
        const recipes = await getAllRecipes();
        
        //カテゴリー毎にレシピをグループ化
        const groupedByCategory = recipes.reduce<Record<string, typeof recipes>>(
            (acc, recipe) => {
                const category = recipe.category || 'other';
                if(!acc[category]){
                    acc[category] = [];
                }
                acc[category].push(recipe);
                return acc;
            },
            {}
        );

        

        }
}