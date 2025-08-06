import { firestore as db } from "../config/firebase";
import {
  getDocs,
  getDoc,
  query,
  where,
  doc,
  collection,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  limit,
} from "firebase/firestore";
import type { Transaction } from "../types/transaction"
import { adjustUserSummary } from "./userSummaryService";

const transactionsRef = collection(db, "transactions")

export async function getAllTransactions(userId: string): Promise<Transaction[]> {
  if (!userId) {
    console.warn("Intento de obtener transacciones sin userId.");
    return [];
  }

  const q = query(
    collection(db, "transactions"),
    where("userId", "==", userId),
    orderBy("date", "desc")
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => {
    const data = doc.data()

    let dateString = ""
    if (data.date instanceof Timestamp) {
      dateString = data.date.toDate().toISOString()
    } else if (typeof data.date === "string") {
      dateString = data.date
    } else {
      console.warn(`Transacción sin campo 'date' válido:`, doc.id, data)
    }

    return {
      id: doc.id,
      title: data.title,
      amount: data.amount,
      category: data.category,
      date: dateString,
      type: data.type,
      userId: data.userId,
    }
  })
}

export async function getCurrentMonthTransactions(userId: string): Promise<Transaction[]> {
  if (!userId) {
    console.warn("Intento de obtener transacciones sin userId.");
    return [];
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const q = query(
    collection(db, "transactions"),
    where("userId", "==", userId),
    where("date", ">=", Timestamp.fromDate(startOfMonth)),
    where("date", "<=", Timestamp.fromDate(endOfMonth)),
    orderBy("date", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    let dateString = "";
    if (data.date instanceof Timestamp) {
      dateString = data.date.toDate().toISOString();
    } else if (typeof data.date === "string") {
      dateString = data.date;
    } else {
      console.warn(`Transacción sin campo 'date' válido:`, doc.id, data);
    }

    return {
      id: doc.id,
      title: data.title,
      amount: data.amount,
      category: data.category,
      date: dateString,
      type: data.type,
      userId: data.userId,
    };
  });
}

export async function getLastTransactions(limitNumber = 5, userId: string): Promise<Transaction[]> {
  const q = query(
    collection(db, "transactions"),
    orderBy("date", "desc"),
    where("userId", "==", userId),
    limit(limitNumber)
  )
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => {
    const data = doc.data()

    let dateString = ""
    if (data.date instanceof Timestamp) {
      dateString = data.date.toDate().toISOString()
    } else if (typeof data.date === "string") {
      dateString = data.date
    } else {
      console.warn(`Transacción sin campo 'date' válido:`, doc.id, data)
    }

    return {
      id: doc.id,
      title: data.title,
      amount: data.amount,
      category: data.category,
      date: dateString,
      type: data.type,
      userId: data.userId
    }
  })
}

export const getTransactionById = async (id: string): Promise<Transaction | null> => {
  const docSnap = await getDoc(doc(transactionsRef, id))
  if (docSnap.exists()) {
    return { id: docSnap.id, ...(docSnap.data() as Omit<Transaction, 'id'>) }
  } else {
    return null
  }
}

export async function addTransaction(data: Omit<Transaction, "id">) {
  await addDoc(collection(db, "transactions"), {
    ...data,
    date: Timestamp.fromDate(new Date(data.date)),
    createdAt: Timestamp.now(),
  })

  await adjustUserSummary(data.userId, data.amount, data.type);
}

export const updateTransaction = async (id: string, newData: Partial<Transaction>) => {
  const docRef = doc(transactionsRef, id);
  const snap = await getDoc(docRef);

  if (!snap.exists()) return;

  const prevData = snap.data() as Transaction;
  await updateDoc(docRef, {
    ...newData,
    ...(newData.date ? { date: Timestamp.fromDate(new Date(newData.date)) } : {}),
  });

  await adjustUserSummary(prevData.userId, -prevData.amount, prevData.type);

  const updatedAmount = newData.amount ?? prevData.amount;
  const updatedType = newData.type ?? prevData.type;
  const updatedUserId = newData.userId ?? prevData.userId;

  await adjustUserSummary(updatedUserId, updatedAmount, updatedType);
}

export const deleteTransaction = async (id: string) => {
  const docRef = doc(transactionsRef, id);
  const snap = await getDoc(docRef);

  if (!snap.exists()) return;

  const data = snap.data();
  const { userId, amount, type } = data;

  await deleteDoc(docRef);
  await adjustUserSummary(userId, -amount, type);
}