import { useState } from "react";
import FileUpload from "./components/FileUpload";
import ChatBox from "./components/ChatBox";

function App() {
  const [fileName, setFileName] = useState(null);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📊 AI Data Agent</h1>
      <FileUpload setFileName={setFileName} />
      {fileName && <ChatBox fileName={fileName} />}
    </div>
  );
}

export default App;
