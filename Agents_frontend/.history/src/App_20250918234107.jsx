import { useState } from "react";
import FileUpload from "./components/FileUpload";
import ChatBox from "./components/ChatBox";

function App() {
  const [fileName, setFileName] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          📊 AI Data Agent
        </h1>
        <div className="bg-white shadow-md rounded-xl p-6">
          <FileUpload setFileName={setFileName} />
          {fileName && <ChatBox fileName={fileName} />}
        </div>
      </div>
    </div>
  );
}

export default App;
