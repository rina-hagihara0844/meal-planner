'use client';
import { useState, useEffect } from "react" 
import { ShoppingItem, Ingredient } from "@/types";
import { createShoppingItem, deleteShoppingItem, getAllShoppingItems } from "@/lib/api/shopping-items";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { getAllIngredients } from "@/lib/api/ingredients";

export default function ShopingPage(){
    const [shoppingItems, setShoppingItems] = useState<(ShoppingItem & { ingredient: Ingredient })[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    // 買い物リストと食材データを取得
    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          
          // データを並行して取得
          const [shoppingItemsData, ingredientsData] = await Promise.all([
            getAllShoppingItems(),
            getAllIngredients(),
          ]);
          
          setShoppingItems(shoppingItemsData);
          setIngredients(ingredientsData);
          setError(null);
        } catch (err) {
          console.error('Failed to fetch data:', err);
          setError('データの取得に失敗しました。');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }, []);

    // アイテムの購入状態を切り替え
    const handleToggleItem = async (id: string, isPurchased: boolean) => {
        try{
            //購入状態を更新
            const updatedItem = await updateShoppingItem(id, {
                is_purchased: isPurchased,
                purchased_date: isPurchased ? new Date().toISOString() : null,
            });

            //画面に表示されてるアイテムを更新 
            setShoppingItems(prevItems => prevItems.map(item => item.id === id ? updatedItem : item))
        } catch (e) {
            console.error('Failed to update shopping item:', e);
            setError('Failed to update shopping item');
          }
    };

    // アイテムを削除
    const handleDeleteItem = async (id: string) => {
        try{
            await deleteShoppingItem(id);
             // 画面から削除されたアイテムを除外
            setShoppingItems(prevItems => prevItems.filter(item => item.id !== id));
        } catch(e) {
            console.error('Failed to delete shopping item:', e);
            setError('Failed to delete shopping item');
        }
    };

    // 購入済みのアイテムをクリア
    const handleClearPurchased = async () => {
        try{
            //購入済みのアイテムを取得
            const purchasedItems = shoppingItems.filter(item => item.is_purchased);
            // 各アイテムを並行して削除
            await Promise.all(purchasedItems.map(item => deleteShoppingItem(item.id)));
             // 画面から購入済みのアイテムを除外
             setShoppingItems(prevItems => prevItems.filter(item => !item.is_purchased));
        } catch (e) {
            console.error('Failed to clear purchased items:', e);
            setError('Failed to clear purchased items');
          }
    };

    // アイテムを追加
    const handleAddItem = async (data: { ingredient_id: string; quantity: number}) => {
        try{
            const newItem = await createShoppingItem({
                ingredient_id: data.ingredient_id,
                quantity: data.quantity,
                is_purchased: false,
                purchased_date: null,
            });

            // 画面に表示されているアイテムを更新
            setShoppingItems(prevItems => [...prevItems, newItem]);
        } catch (e) {
            console.error('Failed to add shopping item:', e);
            setError('Failed to add shopping item');
          }
    };

    // 献立から買い物リストを生成
    {/**　4/15 ここから */}

}

      
      




