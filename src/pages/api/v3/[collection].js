import { getApps, initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import rateLimit from "@/lib/rateLimit";

const firebaseConfig = {
	// your config
};

// Ensure only one Firebase instance is initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Apply rate limiting
const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 5, // limit each IP to 5 requests per windowMs
});

export default async function handler(req, res) {
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
