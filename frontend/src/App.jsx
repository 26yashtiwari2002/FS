import { useEffect, useRef, useState } from "react";
import { UploadFile } from "./service/api";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [res, setRes] = useState(null);
  const [copied, setCopied] = useState(false);

  const uploadRef = useRef();

  const handleUpload = () => {
    uploadRef.current.click();
  };

  const handleCopy = () => {
    if (res) {
      navigator.clipboard.writeText(res);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2 sec
    }
  };

  const handleOpen = () => {
    if (res) {
      window.open(res, "_blank");
    }
  };

  useEffect(() => {
    const apiCall = async () => {
      if (file) {
        const fileData = new FormData();
        fileData.append("name", file.name);
        fileData.append("file", file);

        const response = await UploadFile(fileData);
        setRes(response?.path);
      }
    };
    apiCall();
  }, [file]);

  return (
    <div className="container">
      <h1>File Sharing App</h1>

      <div>
        <button onClick={handleUpload}>Upload</button>
        <input
          type="file"
          ref={uploadRef}
          style={{ display: "none" }}
          onChange={(event) => setFile(event.target.files[0])}
        />
      </div>

      {res && (
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <a href={res}>{res}</a>

          <button onClick={handleCopy}>
            {copied ? (
              <span
                style={{
                  //green checkmark
                  color: "green",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                ✔
              </span>
            ) : (
              "Copy"
            )}
          </button>

          <button onClick={handleOpen}>Download</button>
        </div>
      )}
    </div>
  );
}

export default App;