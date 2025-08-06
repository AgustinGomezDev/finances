import { create } from 'zustand';
import type { User as FirebaseAuthUser } from 'firebase/auth';

type FirestoreUser = {
  uid: string;
  displayName: string;
  currency: string;
  totalIncome: number;
  totalExpense: number;
  monthlyBudget: number;
  monthlyFoodBudget: number;
  monthlyEntertainmentBudget: number;
  monthlyTransportBudget: number;
  monthlyHealthBudget: number;
  monthlyShoppingBudget: number;
  monthlyOthersBudget: number;
  monthlyServicesBudget: number;
  birth: Date | null;
  email: string;
};

type AuthState = {
  firebaseUser: FirebaseAuthUser | null;
  firestoreUser: FirestoreUser | null;
  loading: boolean;
  setFirebaseUser: (user: FirebaseAuthUser | null) => void;
  setFirestoreUser: (user: FirestoreUser | null) => void;
  setLoading: (loading: boolean) => void;
  incrementIncome: (amount: number) => void;
  incrementExpense: (amount: number) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  firebaseUser: null,
  firestoreUser: null,
  loading: true,
  setFirebaseUser: (user) => set({ firebaseUser: user }),
  setFirestoreUser: (user) => set({ firestoreUser: user }),
  setLoading: (loading) => set({ loading }),

  incrementIncome: (amount: number) => {
    const currentUser = get().firestoreUser;
    if (currentUser) {
      set({
        firestoreUser: {
          ...currentUser,
          totalIncome: currentUser.totalIncome + amount,
        },
      });
    }
  },

  incrementExpense: (amount: number) => {
    const currentUser = get().firestoreUser;
    if (currentUser) {
      set({
        firestoreUser: {
          ...currentUser,
          totalExpense: currentUser.totalExpense + amount,
        },
      });
    }
  },
}));
