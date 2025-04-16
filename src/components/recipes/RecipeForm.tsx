import React from "react";
import { Ingredient, Recipe } from "@/types";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import {
  Form,
  FormControl,
  FormItem,
  FormMessage,
  FormField,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Textarea } from "../ui/textarea";

export interface RecipeFormData {
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

interface RecipeFormProps {
  recipe?: Recipe;
  ingredients: Ingredient[];
  onSubmit: (data: RecipeFormData) => void;
  isSubmitting: boolean;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({
  recipe,
  ingredients,
  onSubmit,
  isSubmitting,
}) => {
  const form = useForm<RecipeFormData>({
    defaultValues: recipe
      ? {
          name: recipe.name,
          description: recipe.description,
          category: recipe.category,
          serving_size: recipe.serving_size,
          instructions: recipe.instructions,
          country_of_origin: recipe.country_of_origin || "",
          image_url: recipe.image_url || "",
          ingredients: [],
        }
      : {
          name: "",
          description: "",
          category: "",
          serving_size: 2,
          instructions: "",
          country_of_origin: "",
          image_url: "",
          ingredients: [{ ingredient_id: "", quantity: 1, unit: "g" }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const categoryOptions = [
    { value: "main", label: "main" },
    { value: "side", label: "side" },
    { value: "soup", label: "soup" },
    { value: "breakfast", label: "breakfast" },
  ];

  const ingredientOptions = ingredients.map((ingredient) => ({
    value: ingredient.id,
    label: ingredient.name,
  }));

  const unitOptions = [
    { value: "g", label: "g" },
    { value: "ml", label: "ml" },
    { value: "個", label: "個" },
    { value: "本", label: "本" },
    { value: "枚", label: "枚" },
    { value: "大", label: "大" },
    { value: "小", label: "小" },
  ];
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            rules={{ required: "Recipe Name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipe Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    {categoryOptions.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                {/* 後ほどshadcnインポート */}
                <Textarea {...field} rows={3} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="serving_size"
            rules={{
              required: "Serving size is required",
              min: { value: 1, message: "Please enter a value of 1 or higher" },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serving size</FormLabel>
                <FormControl>
                  <Input type="number" {...field} min={1} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country_of_origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country of Origin</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Ingredient</h3>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() =>
                append({
                  ingredient_id: "",
                  quantity: 1,
                  unit: "g",
                })
              }
            >
              Add Ingredient
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 mb-2">
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name={`ingredients.${index}.ingredient_id`}
                  rules={{ required: "ingredient is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Add Ingredient" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ingredientOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name={`ingredients.${index}.quantity`}
                  rules={{
                    required: "Quantity is required",
                    min: {
                      value: 0,
                      message: "Please enter a value of 0 or higher",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" step="0.1" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name={`ingredients.${index}.unit`}
                  rules={{ required: "Unit is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {unitOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1 flex items-center">
                <Button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => remove(index)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <FormField
            control={form.control}
            name="instructions"
            rules={{ required: "Instruction is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instruction</FormLabel>
                <FormControl>
                  <Textarea rows={6} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="cancel">
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : recipe ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
