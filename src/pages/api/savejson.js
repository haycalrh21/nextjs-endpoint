// pages/api/savejson.js
import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
	// Konfigurasi Anda
};

if (!getApps().length) {
	initializeApp(firebaseConfig);
}
const storage = getStorage();
const firestore = getFirestore();

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			const { data, collectionName } = req.body; // langsung menggunakan req.body tanpa JSON.parse
			const buffer = Buffer.from(JSON.stringify(data), "utf-8");
			const storageRef = ref(storage, `uploads/data-${Date.now()}.json`);
			const snapshot = await uploadBytes(storageRef, buffer);

			if (Array.isArray(data)) {
				const docRefs = await Promise.all(
					data.map((item) =>
						addDoc(collection(firestore, collectionName), item)
					)
				);
				res.status(200).json({
					message: "All documents were added successfully to Firestore",
					documentIds: docRefs.map((doc) => doc.id),
					storagePath: snapshot.metadata.fullPath,
				});
			} else {
				const docRef = await addDoc(
					collection(firestore, collectionName),
					data
				);
				res.status(200).json({
					message: "Data successfully stored in Firestore",
					firestoreDocId: docRef.id,
					storagePath: snapshot.metadata.fullPath,
				});
			}
		} catch (error) {
			console.error("Error uploading data:", error);
			res
				.status(500)
				.json({ message: "Failed to save data", error: error.message });
		}
	} else {
		res.setHeader("Allow", ["POST"]);
		res.status(405).json({ message: "Method not allowed" });
	}
}
