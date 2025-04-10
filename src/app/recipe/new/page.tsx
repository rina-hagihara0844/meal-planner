`use client`
import { getAllIngredients } from "@/lib/api/ingredients";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Ingredient } from "@/types";
import { createRecipe } from "@/lib/api/recipes";
import { Link } from "lucide-react"; 
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/Card";

export default function NewRecipePage(){
    const router = useRouter();
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchIngredients = async () => {
            try{
                const data = await getAllIngredients();
                setIngredients(data);
            } catch(e) {
                console.error('failed to fetch ingredient data:',e);
                setError('failed to fetch ingredients');
            }
        };
        fetchIngredients();
    }, []);

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        setError(null);
        try{
            //recipeデータとingredientデータを分離
            const {ingredients: recipeIngredients, ...recipeData} = data;

            //レシピを作成
            await createRecipe(recipeIngredients, recipeData);
            router.push('/recipe');

        }catch(e){
            console.error('Failed to create recipe:',e);
            setError('Failed to create recipe');
            setIsSubmitting(false);
        }   
    }     
    return(
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <Link href='/recipe' className="text-emerald-600 hover:underline flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Recipe List page.
                    </Link>
                    <h1 className="text-2xl font-bold">Add new recipe</h1>
                </div>
            </div>
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg">
                    {error}
                </div>
            )}
            <Card>
                <CardContent>
                    <RecipeForm
                    ingredients={ingredients}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    />
                </CardContent>
            </Card>
        </div>
    )
}



    

