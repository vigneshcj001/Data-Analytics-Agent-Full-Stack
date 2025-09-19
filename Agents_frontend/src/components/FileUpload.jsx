import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function FileUpload({ setFileName }) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.filename) {
        setFileName(res.data.filename);
        setUploadedFile(file.name);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      className="border-2 border-dashed rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
      whileHover={{ scale: 1.02 }}
    >
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
        id="fileInput"
      />
      <label
        htmlFor="fileInput"
        className="cursor-pointer text-indigo-600 font-medium"
      >
        {uploading
          ? "📤 Uploading..."
          : uploadedFile
          ? `✅ ${uploadedFile}`
          : "📁 Click or drag a CSV/Excel file here"}
      </label>
    </motion.div>
  );
}

export default FileUpload;
