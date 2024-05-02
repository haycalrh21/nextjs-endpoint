// pages/api/addItem.js
import { getFirestore, collection, addDoc } from "firebase/firestore";
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
	if (req.method === "POST") {
		const { collectionName, ...data } = req.body;

		// Cek apakah nama koleksi telah diberikan
		if (!collectionName) {
			res.status(400).json({ error: "Nama koleksi diperlukan" });
			return;
		}

		try {
			// Simpan data ke koleksi yang dinamis berdasarkan input pengguna
			const docRef = await addDoc(collection(db, collectionName), data);
			res.status(200).json({
				id: docRef.id,
				message: "Item berhasil ditambahkan ke koleksi " + collectionName,
			});
		} catch (e) {
			res.status(500).json({ error: e.message });
		}
	} else {
		res.status(405).json({ error: "Metode tidak diizinkan" });
	}
}
