import { useEffect, useRef, useState } from "react";
import { UploadFile } from "./service/api";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [res, setRes] = useState(null);
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState("home");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const uploadRef = useRef();

  const handleUpload = () => {
    uploadRef.current.click();
  };

  const showNotificationWithMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleCopy = (link) => {
    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      showNotificationWithMessage("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpen = (link) => {
    if (link) {
      window.open(link, "_blank");
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    showNotificationWithMessage(`Switched to ${isDarkMode ? "light" : "dark"} mode`);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.size > 50 * 1024 * 1024) { // 50MB limit
        showNotificationWithMessage("File size exceeds 50MB limit");
        return;
      }
      setFile(droppedFile);
    }
  };

  useEffect(() => {
    document.body.className = isDarkMode ? "theme-dark" : "theme-light";
  }, [isDarkMode]);

  useEffect(() => {
    const apiCall = async () => {
      if (file) {
        setLoading(true);
        const fileData = new FormData();
        fileData.append("name", file.name);
        fileData.append("file", file);

        try {
          const response = await UploadFile(fileData);
          if (response?.path) {
            setRes(response.path);
            setHistory((prev) => [response.path, ...prev.slice(0, 9)]);
            showNotificationWithMessage("File uploaded successfully!");
          } else {
            setRes(null);
            showNotificationWithMessage("Upload failed. Please try again.");
          }
        } catch (error) {
          setRes(null);
          showNotificationWithMessage("Error uploading file. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };
    apiCall();
  }, [file]);

  const renderPageContent = () => {
    switch (page) {
      case "about":
        return (
          <div className="info-page">
            <h2>About FileShare</h2>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Fast & Secure</h3>
              <p>Our platform ensures your files are transferred quickly and securely with end-to-end encryption.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔗</div>
              <h3>Easy Sharing</h3>
              <p>Generate shareable links with one click. No registration required.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>History Tracking</h3>
              <p>Keep track of your recently shared files for quick access.</p>
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="info-page">
            <h2>Contact Us</h2>
            <div className="contact-card">
              <div className="contact-method">
                <span className="contact-icon">📧</span>
                <h3>Email</h3>
                <p>tiwariyash20020926@gmail.com</p>
              </div>
              
              <div className="contact-method">
                <span className="contact-icon">💬</span>
                <h3>Feedback</h3>
                <p>We'd love to hear your suggestions!</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            <div
              className={`upload-area ${dragActive ? "drag-active" : ""} ${loading ? "loading" : ""}`}
              onClick={handleUpload}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {loading ? (
                <div className="loading-indicator">
                  <div className="spinner"></div>
                  <p>Uploading your file...</p>
                </div>
              ) : file ? (
                <div className="file-preview">
                  <div className="file-icon">
                    {file.type.startsWith("image/") ? "🖼️" : 
                     file.type.startsWith("video/") ? "🎬" : 
                     file.type.startsWith("audio/") ? "🎵" : 
                     "📄"}
                  </div>
                  <div className="file-info">
                    <p className="file-name">{file.name}</p>
                    <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div className="upload-prompt">
                  <div className="upload-icon">📤</div>
                  <p>Drag & Drop your file here</p>
                  <p className="upload-subtext">or click to browse files</p>
                  <p className="file-limits">Supports all file types • Max 50MB</p>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={uploadRef}
              style={{ display: "none" }}
              onChange={(event) => {
                if (event.target.files[0]) {
                  if (event.target.files[0].size > 50 * 1024 * 1024) {
                    showNotificationWithMessage("File size exceeds 50MB limit");
                    return;
                  }
                  setFile(event.target.files[0]);
                }
              }}
            />

            {!loading && res && (
              <div className="result-area">
                <div className="result-header">
                  <h3>Your file is ready to share!</h3>
                  <p>Copy the link below or download directly</p>
                </div>
                <div className="link-container">
                  <input
                    type="text"
                    value={res}
                    readOnly
                    className="link-input"
                    onClick={(e) => e.target.select()}
                  />
                  <div className="link-actions">
                    <button 
                      onClick={() => handleCopy(res)}
                      className={`copy-btn ${copied ? "copied" : ""}`}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <button 
                      onClick={() => handleOpen(res)}
                      className="download-btn"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            )}

            {history.length > 0 && (
              <div className="history-section">
                <div className="section-header">
                  <h3>Recent Uploads</h3>
                  <button 
                    onClick={() => setHistory([])} 
                    className="clear-history"
                  >
                    Clear History
                  </button>
                </div>
                <div className="history-items">
                  {history.map((link, idx) => (
                    <div key={idx} className="history-item">
                      <div className="item-number">{idx + 1}</div>
                      <div className="item-link">
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.split('/').pop()}
                        </a>
                      </div>
                      <div className="item-actions">
                        <button 
                          onClick={() => handleCopy(link)}
                          className="action-btn copy"
                        >
                          Copy
                        </button>
                        <button 
                          onClick={() => handleOpen(link)}
                          className="action-btn download"
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo" onClick={() => setPage("home")}>
          <span>FileShare</span>
        </div>
        <ul className="nav-links">
          <li
            className={page === "home" ? "active" : ""}
            onClick={() => setPage("home")}
          >
            Home
          </li>
          <li
            className={page === "about" ? "active" : ""}
            onClick={() => setPage("about")}
          >
            About
          </li>
          <li
            className={page === "contact" ? "active" : ""}
            onClick={() => setPage("contact")}
          >
            Contact
          </li>
          <div
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && toggleTheme()}
          >
            {isDarkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                className="icon moon-icon"
                title="Switch to Light Mode"
              >
                <path d="M21 12.79A9 9 0 0111.21 3 7 7 0 0021 12.79z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                className="icon sun-icon"
                title="Switch to Dark Mode"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </div>
        </ul>
      </nav>

      <main className="main-content">{renderPageContent()}</main>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 FileShare. All rights reserved.</p>
          <div className="footer-links">
            <span onClick={() => setPage("about")}>About</span>
            <span onClick={() => setPage("contact")}>Contact</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>

      {showNotification && (
        <div className={`notification ${showNotification ? "show" : ""}`}>
          {notificationMessage}
        </div>
      )}
    </>
  );
}

export default App;