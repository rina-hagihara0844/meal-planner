"use client";

import React, { useState, useEffect } from "react";
import { Ingredient } from "@/types";
import {
  deleteIngredient,
  getAllIngredients,
  updateIngredient,
  createIngredient,
} from "@/lib/api/ingredients";
import { Button } from "@/components/ui/button";
import { IngredientList } from "@/components/ingredients/IngredientList";
import { Card, CardContent } from "@/components/ui/card";
import { IngredientModal } from "@/components/ingredients/IngredientModal";

export default function IngredientPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<
    Ingredient | undefined
  >(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //食材データを取得
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setIsLoading(true);
        const data = await getAllIngredients();
        setIngredients(data);
        setError(null);
      } catch (e) {
        console.error("Failed to fetch ingredients;", e);
        setError("Failed to fetch ingredients");
      } finally {
        setIsLoading(false);
      }
    };
    fetchIngredients();
  }, []);

  //食材追加モーダルを開く
  const handleAddIngredient = () => {
    setSelectedIngredient(undefined);
    setIsModalOpen(true);
  };

  //食材編集モーダルを開く
  const handleEditIngredient = (id: string) => {
    const ingredient = ingredients.find((i) => i.id === id);
    if (ingredient) {
      setSelectedIngredient(ingredient);
      setIsModalOpen(true);
    }
  };

  //食材を削除
  const handleDeleteIngredient = async (id: string) => {
    try {
      await deleteIngredient(id);
      //画面から削除された食材を除外
      setIngredients((prevIngredients) =>
        prevIngredients.filter((i) => i.id !== id)
      );
    } catch (e) {
      console.error("Failed to delete ingredient:", e);
      setError("Failed to delete ingredient");
    }
  };

  //食材を追加、更新
  const handleSaveIngredient = async (
    data: Omit<Ingredient, "id" | "created_at" | "updated_at">
  ) => {
    try {
      if (selectedIngredient) {
        //食材を更新
        const updatedIngredient = await updateIngredient(
          selectedIngredient.id,
          data
        );
        //画面に表示されている食材を更新
        setIngredients((prevIngredients) =>
          prevIngredients.map((ingredient) =>
            ingredient.id === selectedIngredient.id
              ? updatedIngredient
              : ingredient
          )
        );
      } else {
        //食材を追加
        const newIngredient = await createIngredient(data);

        //画面に表示されている食材を更新
        setIngredients((prevIngredients) => [
          ...prevIngredients,
          newIngredient,
        ]);
      }

      setIsModalOpen(false);
      setError(null);
    } catch (e) {
      console.error("failed to save ingredient:", e);
      setError("failed to save ingredient:");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-t-4 border-emerald-500 border-solid rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-start items-center">
        <h1 className="text-2xl font-bold">Ingredient Management Page</h1>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>
      )}

      <Card>
        <CardContent className="p-6 bg-white">
          <IngredientList
            ingredients={ingredients}
            onAddIngredient={handleAddIngredient}
            onEditIngredient={handleEditIngredient}
            onDeleteIngredient={handleDeleteIngredient}
          />
        </CardContent>
      </Card>

      <IngredientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveIngredient}
        ingredient={selectedIngredient}
      />
    </div>
  );
}
