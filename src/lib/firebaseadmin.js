// Importing using ES Modules syntax
import serviceAccount from "../../public/server-ad685-firebase-adminsdk-oeit3-34462c628a.json";

import admin from "firebase-admin";

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
}

const db = admin.firestore();

export default db;
