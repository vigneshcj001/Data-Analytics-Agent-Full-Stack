import axios from "axios";
import { useState } from "react";

function FileUpload({ setFileName }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFileName(res.data.filename);
    } catch (err) {
      alert("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition">
        <span className="text-gray-600">
          {loading ? "Uploading..." : "Click or drag a CSV/Excel file here"}
        </span>
        <input
          type="file"
          accept=".csv, .xlsx"
          className="hidden"
          onChange={handleUpload}
        />
      </label>
    </div>
  );
}

export default FileUpload;
