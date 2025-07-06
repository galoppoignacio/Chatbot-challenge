import * as admin from 'firebase-admin';

export const firebaseApp = admin.apps.length
  ? admin.app()
  : admin.initializeApp({
      credential: admin.credential.cert(
        require('../../firebase-service-account.json') as admin.ServiceAccount
      ),
    });

export const firestore = admin.firestore();
