'use client';
import { Ingredient, ShoppingItem } from "@/types";
import React, {useState} from "react";
import { useForm } from "react-hook-form";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "../ui/select";
import { Form, FormItem, FormControl, FormField, FormMessage } from "../ui/form";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";


interface AddShoppingItemFormData{
    ingredient_id: string;
    quantity: number;
}

interface AddShoppingItemModalProps{
    IsOpen: boolean;
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

useForm<AddShoppingItemFormData>({
        defaultValues: {
          ingredient_id: '',
          quantity: 1,
        },
      });



    const form = useForm<AddShoppingItemFormData>({
        defaultValues:{
            ingredient_id: "",
            quantity: 1,
        }
    });

    const ingredientOptions = [
        ingredients.map(ingredient => ({
                value: ingredient.id,
                label: ingredient.name,
            }))
    ];

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
                <div>
                    {/**続きここの中 4/15*/}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onAddItem())}>
                            <FormField 
                            control={form.control}
                            name="ingredient_id"
                            render={({field}) => (
                                <FormItem>
                                <FormControl>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ingredients.map((item) =>
                                                <SelectItem key={item.id} value={field.value}>
                                                    {item.name}
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={onClose}>Cancel</Button>
                            <Button 
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            >
                            {isSubmitting ? 'Submitting...' : 'Add'}
                            </Button>               
                    </div>                             
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}         



