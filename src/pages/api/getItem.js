// pages/api/getItems.js
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
	apiKey: "AIzaSyDfDdflOegGkNI_QomfnM8W7AV6wwvdSlg",
	authDomain: "server-ad685.firebaseapp.com",
	projectId: "server-ad685",
	storageBucket: "server-ad685.appspot.com",
	messagingSenderId: "321678842449",
	appId: "1:321678842449:web:cf9aad24250e63d3d97670",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const itemsCollection = collection(db, "items");
			const snapshot = await getDocs(itemsCollection);
			const itemsList = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			res.status(200).json(itemsList);
		} catch (e) {
			res.status(500).json({ error: e.message });
		}
	} else {
		res.status(405).json({ error: "Metode tidak diizinkan" });
	}
}
