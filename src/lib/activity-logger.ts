
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function logActivity(userId: string, action: string, details: string) {
    try {
        await addDoc(collection(db, 'activities'), {
            userId,
            action,
            details,
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        
    }
}
