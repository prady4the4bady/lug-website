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
