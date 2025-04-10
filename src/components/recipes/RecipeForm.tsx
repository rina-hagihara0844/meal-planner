import React from "react";
import { Ingredient, Recipe } from "@/types";
import { useForm } from "react-hook-form";

interface RecipeFormData{
    name: string;
    description: string;
    category: string;
    serving_size: number;
    instructions: string;
    country_of_origin?: string;
    image_url?: string;
    ingredients: {
        ingredient_id: string;
        quantity: number;
        unit: string;
    }[];
}

interface RecipeFormProps{
    recipe?: Recipe;
    ingredients: Ingredient[];
    onSubmit: (data: RecipeFormData) => void;
    isSubmitting: boolean;
}

export const RecipeForm: React.FC = ({
    recipe,
    ingredients,
    onSubmit,
    isSubmitting
}) => {

    const form = useForm<RecipeFormData>({
        defaultValues: recipe ? {
            name: recipe.name,
            description: recipe.description,
            category: recipe.category,
            serving_size: recipe.serving_size,
            instructions: recipe.instructions,
            country_of_origin: recipe.country_of_origin || '',
            image_url: recipe.image_url || '',
            ingredients: [], 
        } : {
            name: '',
            description: '',
            category: '',
            serving_size: 2,
            instructions: '',
            country_of_origin: '',
            image_url: '',
            ingredients: [{ ingredient_id: '', quantity: 1, unit: 'g' }],
        }
    });

    const {field, append, remove} = useFieldArray({
        form.control,
        name: 'ingredients',
    });

    const categoryOptions = [
        { value: 'main', label: 'main' },
        { value: 'side', label: 'side' },
        { value: 'soup', label: 'soup' },
        { value: 'breakfast', label: 'breakfast' },
    ];

    //明日4/11ここから




} 