// pages/api/saveJson.js
import fs from "fs";
import path from "path";

export default function handler(req, res) {
	if (req.method === "POST") {
		const data = JSON.stringify(req.body, null, 2);
		const filePath = path.join(process.cwd(), "data", "output.json");
		fs.writeFile(filePath, data, (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: "Failed to save the file" });
			}
			res.status(200).json({ message: "File saved successfully" });
		});
	} else {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
