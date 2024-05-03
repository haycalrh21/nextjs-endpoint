import db from "@/lib/firebaseadmin";

export default async function handler(req, res) {
	try {
		const collections = await db.listCollections();
		const collectionNames = collections.map((col) => col.id);
		res.status(200).json({ collections: collectionNames });
	} catch (error) {
		console.error("Error accessing Firestore", error);
		res.status(500).json({
			error: "Failed to fetch collection names",
			detail: error.message,
		});
	}
}
