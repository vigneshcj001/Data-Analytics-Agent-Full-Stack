import axios from "axios";

function FileUpload({ setFileName }) {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("http://localhost:8000/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setFileName(res.data.filename);
    alert("✅ File uploaded successfully!");
  };

  return (
    <div className="mb-4">
      <input type="file" accept=".csv, .xlsx" onChange={handleUpload} />
    </div>
  );
}

export default FileUpload;
