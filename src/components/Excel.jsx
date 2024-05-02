// src/components/ExcelUploadForm.js
import React, { useState } from "react";
import * as XLSX from "xlsx";

function ExcelUploadForm() {
	const [file, setFile] = useState(null);
	const [collectionName, setCollectionName] = useState("");
	const [loading, setLoading] = useState(false);

	const handleConvert = async () => {
		if (file && collectionName) {
			setLoading(true);
			const reader = new FileReader();
			reader.onload = async (e) => {
				try {
					const data = e.target.result;
					const workbook = XLSX.read(data, { type: "binary" });
					const sheetName = workbook.SheetNames[0];
					const worksheet = workbook.Sheets[sheetName];
					const json = XLSX.utils.sheet_to_json(worksheet);
					const jsonData = JSON.stringify({ data: json, collectionName });

					const response = await fetch("/api/savejson", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: jsonData,
					});
					const result = await response.json();
					alert(result.message);
				} catch (error) {
					alert("Error: " + error.message);
				} finally {
					setLoading(false); // Hentikan loading
				}
			};
			reader.readAsBinaryString(file);
		} else {
			alert("File dan nama koleksi diperlukan");
		}
	};

	return (
		<div className='flex flex-col items-center justify-center p-5 space-y-4 bg-gray-100 rounded-lg shadow-md'>
			<input
				type='file'
				accept='.xls,.xlsx'
				className='block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-violet-50 file:text-violet-700
                   hover:file:bg-violet-100'
				onChange={(e) => setFile(e.target.files[0])}
				disabled={loading}
			/>
			<input
				type='text'
				placeholder='Nama Koleksi'
				value={collectionName}
				className='form-input w-full p-2 text-gray-700 border rounded-md focus:border-violet-500 focus:ring focus:ring-violet-300 focus:ring-opacity-50'
				onChange={(e) => setCollectionName(e.target.value)}
				disabled={loading}
			/>
			<button
				className='px-4 py-2 text-white bg-violet-600 rounded hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50'
				onClick={handleConvert}
				disabled={loading}
			>
				{loading ? "Loading..." : "Konversi"}
			</button>
		</div>
	);
}

export default ExcelUploadForm;
