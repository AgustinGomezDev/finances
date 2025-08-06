import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore as db } from '../config/firebase';
import { useAuthStore } from '../stores/useAuthStore';
import { doc, getDoc } from 'firebase/firestore';

type FirestoreUserData = {
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

export function AuthWatcher() {
  const setFirebaseUser = useAuthStore((state) => state.setFirebaseUser);
  const setFirestoreUser = useAuthStore((state) => state.setFirestoreUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);

        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data() as FirestoreUserData;

          setFirestoreUser({
            uid: firebaseUser.uid,
            ...data,
          });
        } else {
          setFirestoreUser(null);
        }
      } else {
        setFirebaseUser(null);
        setFirestoreUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [setFirebaseUser, setFirestoreUser, setLoading]);

  return null;
}
