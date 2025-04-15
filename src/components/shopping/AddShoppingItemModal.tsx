'use client';
import { Ingredient, ShoppingItem } from "@/types";
import React, {useState} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "../ui/select";
import { Form, FormItem, FormControl, FormField, FormMessage, FormLabel } from "../ui/form";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";


interface AddShoppingItemFormData{
    ingredient_id: string;
    quantity: number;
}

interface AddShoppingItemModalProps{
    isOpen: boolean;
    onClose: () => void, 
    ingredients: Ingredient[];
    onAddItem: (data: AddShoppingItemFormData) => Promise<void>;
} 

export const AddShoppingItemModal: React.FC<AddShoppingItemModalProps> = ({
    IsOpen,
    onClose,
    ingredients,
    onAddItem,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<AddShoppingItemFormData>({
        defaultValues:{
            ingredient_id: "",
            quantity: 1,
        }
    });

    const ingredientOptions = ingredients.map(ingredient => ({
                value: ingredient.id,
                label: ingredient.name,
            }));

    const onSubmit = async (data: AddShoppingItemFormData) => {
        setIsSubmitting(true);
        try{
            await onAddItem(data);
            form.reset();
            onClose();
        } catch (e) {
            console.error('Failed to add shopping item:', e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return(
        <Dialog open={IsOpen} onOpenChange={open => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add to shopping list
                    </DialogTitle>
                </DialogHeader>
                    <Form {...form}>
                        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField 
                            control={form.control}
                            name="ingredient_id"
                            rules={{required: 'ingredient is required'}}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Ingredient</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ingredientOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ));}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="quantity"
                            rules={{
                                required:"quantity is required",
                                min: {
                                    value: 1,
                                    message: "Please enter a value of 1 or more.",
                                }
                            }}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                        <Input 
                                        type="number"
                                        step={1}
                                        min={1}
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            />
                <DialogFooter>
                    <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={onClose}>Cancel</Button>
                            <Button 
                            type="submit"
                            disabled={isSubmitting}
                            >
                            {isSubmitting ? 'Submitting...' : 'Add'}
                            </Button>               
                    </div>                             
                </DialogFooter>
                </form>
            </Form>
            </DialogContent>
        </Dialog>
    )
}         



