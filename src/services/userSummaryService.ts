import { firestore as db } from "../config/firebase";
import {
    getDoc,
    doc,
    updateDoc,
    setDoc,
    increment
} from "firebase/firestore";

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

export async function adjustUserSummary(userId: string, amount: number, type: "income" | "expense") {
    const summaryRef = doc(db, "summaries", userId)

    try {
        await updateDoc(summaryRef, {
            totalIncome: type === "income" ? increment(amount) : increment(0),
            totalExpense: type === "expense" ? increment(amount) : increment(0),
        })
    } catch (error: any) {
        if (error.code === "not-found") {
            await setDoc(summaryRef, {
                totalIncome: type === "income" ? amount : 0,
                totalExpense: type === "expense" ? amount : 0,
            })
        } else {
            throw error
        }
    }
}