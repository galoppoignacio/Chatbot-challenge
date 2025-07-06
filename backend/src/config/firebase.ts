import * as admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG!);

export const firebaseApp = admin.apps.length
  ? admin.app()
  : admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

export const firestore = admin.firestore();
