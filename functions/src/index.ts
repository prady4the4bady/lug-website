import {
  onCall,
  HttpsError,
} from "firebase-functions/v2/https";
import {
  initializeApp,
} from "firebase-admin/app";
import {
  getAuth,
} from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

interface AdminRoleRequest {
  userId: string;
  makeAdmin: boolean;
}

export const setAdminRole = onCall < AdminRoleRequest >(async (request) => {
  if (!request.auth?.token?.admin) {
    throw new HttpsError(
      "permission-denied",
      "You must be an admin to modify user roles."
    );
  }

  try {
    await getAuth().setCustomUserClaims(request.data.userId, {
      admin: request.data.makeAdmin,
    });
  } catch (error) {
    console.error("Error setting custom claims:", error);
    throw new HttpsError(
      "internal",
      "An error occurred while setting user roles."
    );
  }

  return {
    message: `Success! User ${request.data.userId} has been updated.`,
  };
});


export const syncUsers = onCall(async (request) => {
  if (!request.auth?.token?.admin) {
    throw new HttpsError(
      "permission-denied",
      "You must be an admin to perform this action."
    );
  }

  const db = getFirestore();
  const auth = getAuth();

  try {
    const firestoreUsers = await db.collection("users").get();
    const allAuthUsers = await auth.listUsers();
    const authUserIds = new Set(allAuthUsers.users.map(u => u.uid));

    const batch = db.batch();
    let deletedCount = 0;

    firestoreUsers.forEach(doc => {
      if (!authUserIds.has(doc.id)) {
        batch.delete(doc.ref);
        deletedCount++;
      }
    });

    await batch.commit();

    return {
      message: `Sync complete. Removed ${deletedCount} orphaned user(s).`,
    };

  } catch (error) {
    console.error("Error syncing users:", error);
    throw new HttpsError(
      "internal",
      "An error occurred while syncing users."
    );
  }
});