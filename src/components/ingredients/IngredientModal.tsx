import { Ingredient } from "@/types";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {Select, SelectContent, SelectTrigger, SelectValue, SelectItem} from '@/components/ui/select';

interface IngredientFormData {
  name: string;
  category: string;
  unit: string;
}

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient?: Ingredient;
  onSubmit: (data: IngredientFormData) => Promise<void>;
}

export const IngredientModal: React.FC<IngredientModalProps> = ({
  isOpen,
  onClose,
  ingredient,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);


  const form = useForm<IngredientFormData>({
    defaultValues: {
          name: "",
          category: "",
          unit: "g",
        },
  });

  
  useEffect(() => {
    if (ingredient) {
      form.reset({
        name: ingredient.name,
        category: ingredient.category,
        unit: ingredient.unit,
      });
    }
  }, [ingredient]);


  const CategoryOptions = [
    { value: "Vegetables", label: "Vegetables" },
    { value: "Meat", label: "Meat" },
    { value: "Seafood", label: "Seafood" },
    { value: "Dairy", label: "Dairy" },
    { value: "Seasoning", label: "Seasoning" },
    { value: "Grains", label: "Grains" },
    { value: "Fruits", label: "Fruits" },
    { value: "Others", label: "Others" },
  ];
  

  const unitOptions = [
    { value: "g", label: "g" },
    { value: "kg", label: "kg" },
    { value: "ml", label: "ml" },
    { value: "L", label: "L" },
    { value: "個", label: "個" },
    { value: "本", label: "本" },
    { value: "枚", label: "枚" },
    { value: "袋", label: "袋" },
    { value: "束", label: "束" },
    { value: "大", label: "大" },
    { value: "小", label: "小" },
  ];

  const handleFormSubmit = async (data: IngredientFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (e) {
      console.error("Failed to save ingredient:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {ingredient ? "Edit Ingredient" : "Add New Ingredient"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}  className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredient Name</FormLabel>
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
              rules={{ required: "category is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      {CategoryOptions.map((option) => (
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

            <FormField
              control={form.control}
              name="unit"
              rules={{ required: "Unit is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unitOptions.map((option) => (
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
            <DialogFooter className="sm:justify-end gap-3 mt-6">
              <Button variant="cancel" onClick={onClose}>Cancel</Button>
              <Button
                variant="primary"
                onClick={form.handleSubmit(handleFormSubmit)}
                disabled={isSubmitting}
              >
              {isSubmitting ? "Saving..." : ingredient ? "Update" : "Add"}
              </Button>
              </DialogFooter>
          </form>
        </Form>
      </DialogContent>

    </Dialog>
  );
};