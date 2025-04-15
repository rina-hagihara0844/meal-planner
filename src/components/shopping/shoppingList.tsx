import { ShoppingItem } from "@/types"
import React from "react";
import { Ingredient } from "@/types";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card"; 
import { Checkbox } from "../ui/checkbox";
import { X } from "lucide-react";

interface ShoppingListProps{
    items: (ShoppingItem & { ingredient: Ingredient})[];
    onToggleItem: (id: string, isPurchased: boolean) => Promise<void>;
    onDeleteItem: (id: string) => Promise<void>;
    onClearPurchased: () => Promise<void>;
}

export const ShoppingList: React.FC<ShoppingListProps> = (
    {
        items,
        onToggleItem,
        onDeleteItem,
        onClearPurchased,
    }
) => {
    //買い物リストをカテゴリ毎に分ける
    const groupedItems = items.reduce<Record<string, (ShoppingItem & {ingredient: Ingredient})[]>>(
        (acc, item) => {
        const category = item.ingredient.category;
        if(!acc[category]){
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});

    //カテゴリーをソートする
    const sortedCategories = Object.keys(groupedItems).sort();


    //買い物リストの合計と購入済みアイテムをカウントする
    const totalItems = items.length;
    const purchasedItems = items.filter(item => item.is_purchased).length;
    const progress = totalItems > 0 ? (purchasedItems / totalItems) * 100 : 0;


    return(
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Shopping List</h2>
                    <p className="text-sm text-gray-500">
                    {purchasedItems} / {totalItems} is purchased.
                    </p>
                </div>

                {purchasedItems > 0 && (
                    <Button variant="outline" onClick={onClearPurchased}>
                        Clear purchased items
                    </Button>
                )}
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                className="bg-emerald-500 h-2 rounded-full" 
                style={{ width: `${progress}%` }}
                >
                </div>
            </div>

            <div className="space-y-6">
                {sortedCategories.map((category) => {
                    const categoryItems = groupedItems[category];
                    return(
                    <Card key={category}>
                        <CardHeader className="py-3 px-4">
                            <h3 className="font-medium">{category}</h3>
                        </CardHeader>
                        <CardContent className="pt-0 px-4 pb-4">
                            <ul className="divide-y">
                                {categoryItems.map(item => (
                                    <li key={item.id} className="py-3 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Checkbox 
                                            checked={item.is_purchased}
                                            onCheckedChange={(checked) => onToggleItem(item.id, Boolean(checked))}
                                            className="mr-3"
                                            />
                                            <span className={item.is_purchased ? 'line-through text-gray-400' : ''}>
                                                {item.ingredient.name} ({item.quantity} {item.ingredient.unit})
                                            </span>
                                        </div>
                                        <button
                                        type="button"
                                        onClick={() => onDeleteItem(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="w-5 h-5"/>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                
                )})}
            </div>
        </div>
    )
}




