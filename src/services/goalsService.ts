
import { collection, getDocs, updateDoc, doc, deleteDoc, setDoc } from 'firebase/firestore'
import { firestore as db } from '../config/firebase'
import type { Goal } from '../types/goal'

export async function getUsersGoals(userId: string) {
    const snap = await getDocs(collection(db, 'goals', userId, 'items'))

    return snap.docs.map(doc => ({ ...doc.data() }) as Goal)
}

export async function createGoal(newGoal: Omit<Goal, 'id'>, userId: string): Promise<Goal> {
  const goalsCollectionRef = collection(db, 'goals', userId, 'items')
  const newDocRef = doc(goalsCollectionRef)
  const goalWithId = {
    ...newGoal,
    id: newDocRef.id,
    createdAt: new Date(),
  }
  await setDoc(newDocRef, goalWithId)
  return goalWithId
}

export async function deleteGoal(userId: string, goalId: string) {
    if (!userId || !goalId) throw new Error('userId and goalId are required')

    const goalRef = doc(db, 'goals', userId, 'items', goalId)
    await deleteDoc(goalRef)
}

export async function updateGoal(goal: Goal, userId: string, goalId: string) {
    const goalRef = doc(db, 'goals', userId, 'items', goalId);
    await updateDoc(goalRef, {
        progress: goal.progress,
        goal: goal.goal,
        color: goal.color,
        icon: goal.icon,
        title: goal.title,
    });
}