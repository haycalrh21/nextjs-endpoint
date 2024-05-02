import { getApps, initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import rateLimit from "@/lib/rateLimit";
const firebaseConfig = {
	apiKey: "AIzaSyDfDdflOegGkNI_QomfnM8W7AV6wwvdSlg",
	authDomain: "server-ad685.firebaseapp.com",
	projectId: "server-ad685",
	storageBucket: "server-ad685.appspot.com",
	messagingSenderId: "321678842449",
	appId: "1:321678842449:web:cf9aad24250e63d3d97670",
};

// Ensure only one Firebase instance is initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 5, // limit each IP to 5 requests per windowMs
});

export default async function handler(req, res) {
	const apiKey = req.query.api_key; // Ambil API key dari query parameter
	const validApiKey = process.env.API_KEY; // API key yang disimpan di environment variable

	if (!apiKey || apiKey !== validApiKey) {
		return res.status(401).json({ error: "Unauthorized access" }); // Akses tidak diizinkan jika API key tidak valid
	}

	// Lanjutkan dengan logic asli jika API key valid
	limiter(req, res, async () => {
		const collectionName = req.query.collection;
		if (!collectionName) {
			return res.status(400).json({ error: "Nama koleksi diperlukan" });
		}

		if (req.method === "GET") {
			try {
				const itemsCollection = collection(db, collectionName);
				const snapshot = await getDocs(itemsCollection);
				const itemsList = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				return res.status(200).json(itemsList);
			} catch (error) {
				return res.status(500).json({ error: error.message });
			}
		} else {
			return res.status(405).json({ error: "Metode tidak diizinkan" });
		}
	});
}
