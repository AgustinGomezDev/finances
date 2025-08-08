import { firestore as db } from "../config/firebase";
import {
  doc,
  updateDoc,
  setDoc,
  increment
} from "firebase/firestore";
import { useAuthStore } from "../stores/useAuthStore";

export async function updateUserConfig(userId: string, currency: string,
  monthlyBudget: number,
  monthlyFoodBudget: number,
  monthlyTransportBudget: number,
  monthlyEntertainmentBudget: number,
  monthlyShoppingBudget: number,
  monthlyHealthBudget: number,
  monthlyServicesBudget: number,
  monthlyOthersBudget: number,
) {
  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    monthlyBudget,
    monthlyFoodBudget,
    monthlyTransportBudget,
    monthlyEntertainmentBudget,
    monthlyShoppingBudget,
    monthlyHealthBudget,
    monthlyServicesBudget,
    monthlyOthersBudget,
    currency,
  })
}

export async function adjustUserSummary(userId: string, amount: number, type: "income" | "expense") {
  const userRef = doc(db, "users", userId);

  try {
    await updateDoc(userRef, {
      totalIncome: type === "income" ? increment(amount) : increment(0),
      totalExpense: type === "expense" ? increment(amount) : increment(0),
    });

    const { incrementIncome, incrementExpense } = useAuthStore.getState();
    if (type === "income") {
      incrementIncome(amount);
    } else {
      incrementExpense(amount);
    }
  } catch (error: any) {
    if (error.code === "not-found") {
      await setDoc(userRef, {
        totalIncome: type === "income" ? amount : 0,
        totalExpense: type === "expense" ? amount : 0,
      });
    } else {
      throw error;
    }
  }
}