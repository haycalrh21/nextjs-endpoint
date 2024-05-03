import ExcelUploadForm from "@/components/Excel";
import { useEffect, useState } from "react";

export default function Home() {
	const [fields, setFields] = useState([{ key: "", value: "" }]);
	const [collectionName, setCollectionName] = useState("");
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState({ collections: [] });
	const fetchData = async () => {
		try {
			const response = await fetch("/api/v3/collect");
			if (!response.ok) {
				throw new Error("API gagal");
			}
			const json = await response.json();
			setData(json);
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleChange = (index, type, event) => {
		const newFields = fields.map((field, i) => {
			if (i === index) {
				return { ...field, [type]: event.target.value };
			}
			return field;
		});
		setFields(newFields);
	};

	const handleAddField = () => {
		setFields([...fields, { key: "", value: "" }]);
	};

	const handleRemoveField = (index) => {
		setFields(fields.filter((_, i) => i !== index));
	};

	async function handleSubmit(e) {
		e.preventDefault();
		if (!collectionName.trim()) {
			alert("Nama koleksi tidak boleh kosong");
			return;
		}

		const hasEmptyFields = fields.some(
			(field) => !field.key.trim() || !field.value.trim()
		);
		if (hasEmptyFields) {
			alert("Semua label dan nilai harus diisi");
			return;
		}
		setLoading(true);

		const data = fields.reduce((obj, field) => {
			if (field.key && field.value) {
				obj[field.key] = field.value;
			}
			return obj;
		}, {});

		const response = await fetch("/api/addItem", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				data,
				collectionName, // Kirimkan nama koleksi sebagai string
			}),
		});

		try {
			if (response.ok) {
				alert("Item berhasil ditambahkan");
				setFields([{ key: "", value: "" }]); // Reset form
			} else {
				const error = await response.json();
				alert(`Gagal menambahkan item: ${error.error}`);
			}
		} catch (error) {
			throw new Error(error);
		} finally {
			setLoading(false);
			fetchData();
		}
	}

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
			<div className='mb-10'>
				<h1 className='text-3xl font-bold text-center'>List Daftar api</h1>
				<p className='text-1xl font-bold text-center'>
					cara untuk menggunakannya /api/v3/namaapi?api_key=rahasia
				</p>
			</div>
			<div className='container mx-auto px-4 mb-3'>
				<ul className='grid grid-cols-2 md:grid-cols-4 gap-4'>
					{data.collections.map((collection, index) => (
						<li
							key={index}
							className='bg-gray-200 rounded-lg p-2 shadow text-sm'
						>
							{collection}
						</li>
					))}
				</ul>
			</div>
			<form
				onSubmit={handleSubmit}
				className='max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md'
			>
				<div>
					<h2 className='text-2xl font-bold text-center'>
						Input manual ke api
					</h2>
				</div>
				<input
					type='text'
					placeholder='Nama Koleksi'
					value={collectionName}
					onChange={(e) => setCollectionName(e.target.value)}
					className='w-full p-3 border border-gray-300 rounded mt-4 focus:ring-2 focus:ring-blue-300'
					disabled={loading}
				/>
				{fields.map((field, index) => (
					<div key={index} className='flex flex-wrap items-center mt-4 gap-2'>
						<input
							type='text'
							disabled={loading}
							placeholder='Label'
							value={field.key}
							onChange={(e) => handleChange(index, "key", e)}
							className='flex-grow p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-300'
						/>
						<input
							type='text'
							placeholder='Value'
							disabled={loading}
							value={field.value}
							onChange={(e) => handleChange(index, "value", e)}
							className='flex-grow p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-300'
						/>
						<button
							type='button'
							disabled={loading}
							onClick={() => handleRemoveField(index)}
							className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out'
						>
							Hapus
						</button>
					</div>
				))}
				<div className='flex flex-wrap justify-between items-center mt-6 gap-4'>
					<button
						type='button'
						onClick={handleAddField}
						disabled={loading}
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex-grow sm:flex-grow-0'
					>
						Tambah Field
					</button>
					<button
						type='submit'
						disabled={loading}
						className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex-grow sm:flex-grow-0'
					>
						{loading ? "Loading..." : "Kirim"}
					</button>
				</div>
			</form>
			<div className='mt-4'></div>
			<div className='max-w-lg mx-auto mt-4'>
				<ExcelUploadForm />
			</div>
		</div>
	);
}
