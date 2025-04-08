import { Ingredient } from "@/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
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
    defaultValues: ingredient
      ? {
          name: ingredient.name,
          category: ingredient.category,
          unit: ingredient.unit,
        }
      : {
          name: "",
          category: "",
          unit: "g",
        },
  });

  const CategoryOptions = [
    { value: "", label: "Choose Category" },
    { value: "vegetables", label: "Vegetables" },
    { value: "meat", label: "Meat" },
    { value: "seafood", label: "Seafood" },
    { value: "dairy", label: "Dairy" },
    { value: "seasoning", label: "Seasoning" },
    { value: "grains", label: "Grains" },
    { value: "fruits", label: "Fruits" },
    { value: "others", label: "Others" },
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
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
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
              rules={{ required: "カテゴリーは必須です" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>カテゴリー</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="カテゴリーを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
              rules={{ required: "単位は必須です" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>単位</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="単位を選択" />
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
          </form>
        </Form>
      </DialogContent>
      <DialogFooter className="sm:justify-end gap-3 mt-6">
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={form.handleSubmit(handleFormSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : ingredient ? "Update" : "Add"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
