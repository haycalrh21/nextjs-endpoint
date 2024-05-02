// Konfigurasi Firebase
const firebaseConfig = {
	apiKey: "AIzaSyDfDdflOegGkNI_QomfnM8W7AV6wwvdSlg",
	authDomain: "server-ad685.firebaseapp.com",
	projectId: "server-ad685",
	storageBucket: "server-ad685.appspot.com",
	messagingSenderId: "321678842449",
	appId: "1:321678842449:web:cf9aad24250e63d3d97670",
};

// Inisialisasi aplikasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Handler untuk API
export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			// Referensi ke koleksi tempat Anda menyimpan nama-nama koleksi

			res.status(200).json(collectionNames);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	} else {
		res.status(405).end(); // Method Not Allowed
	}
}
