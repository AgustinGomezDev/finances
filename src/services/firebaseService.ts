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
  limit
} from "firebase/firestore";
import type { Transaction } from "../types/transaction"

const transactionsRef = collection(db, "transactions")

// 🔹 Obtener todas las transacciones ordenadas por fecha
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

// 🔹 Obtener una sola transacción por ID
export const getTransactionById = async (id: string) => {
  const docSnap = await getDoc(doc(transactionsRef, id))
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() }
  } else {
    return null
  }
}

// 🔹 Crear nueva transacción
export async function addTransaction(data: Omit<Transaction, "id">) {
  await addDoc(collection(db, "transactions"), {
    ...data,
    date: Timestamp.fromDate(new Date(data.date)),
    createdAt: Timestamp.now(),
  })
}

// 🔹 Editar transacción existente
export const updateTransaction = async (id: string, data: Partial<{
  type: "income" | "expense",
  amount: number,
  category: string,
  note?: string
}>) => {
  return await updateDoc(doc(transactionsRef, id), data)
}

// 🔹 Eliminar transacción
export const deleteTransaction = async (id: string) => {
  return await deleteDoc(doc(transactionsRef, id))
}

export async function getUserSummary(userId: string): Promise<{ totalIncome: number; totalExpense: number }> {
  if (!userId) {
    console.warn("Intento de obtener resumen sin userId.");
    return { totalIncome: 0, totalExpense: 0 };
  }

  const userRef = doc(db, "summaries", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      totalIncome: typeof data.totalIncome === "number" ? data.totalIncome : 0,
      totalExpense: typeof data.totalExpense === "number" ? data.totalExpense : 0,
    };
  } else {
    console.warn(`No se encontró el documento del usuario con ID ${userId}`);
    return { totalIncome: 0, totalExpense: 0 };
  }
}