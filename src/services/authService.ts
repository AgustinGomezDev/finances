import { auth, firestore as db } from "../config/firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth"
import { doc, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth"

const googleProvider = new GoogleAuthProvider()

export const register = async (email: string, password: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Crear el summary con valores iniciales en Firestore
  const userSummaryRef = doc(db, "summaries", user.uid);
  await setDoc(userSummaryRef, { totalIncome: 0, totalExpense: 0 });

  return user;
};

export const login = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export const loginWithGoogle = async (): Promise<User> => {
  const userCredential = await signInWithPopup(auth, googleProvider)
  return userCredential.user
}

export const logout = async (): Promise<void> => {
  await signOut(auth)
}

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}