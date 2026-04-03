import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Plus, Download, Loader2, Bot } from "lucide-react";
import { fetchResources, createResource } from "../../api/resourceApi";

interface Resource {
  _id: string;
  title: string;
  description: string;
  subject: string;
  fileUrl: string;
  uploadedBy: { name: string; email: string } | string;
  status: string;
  createdAt: string;
}

interface Props {
  setActiveTab?: (tab: string) => void;
  initialShowForm?: boolean;
}

export const ResourceHub: React.FC<Props> = ({ setActiveTab, initialShowForm = false }) => {
  const { user } = useAuth();

  const [resources, setResources] = useState<Resource[]>([]);
  const [showForm, setShowForm] = useState(initialShowForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [uploadType, setUploadType] = useState<"file" | "link">("file");
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    fileUrl: "",
  });

  // Fetch resources from backend
  const loadResources = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchResources();
      setResources(data);
    } catch {
      // If the API fails (e.g. not running), show a message
      setError("Could not load resources. Make sure the server is running.");
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleAddResource = async () => {
    if (!formData.title.trim() || !formData.subject.trim()) return;
    if (uploadType === "link" && !formData.fileUrl?.trim()) return;
    if (uploadType === "file" && !file) return;

    try {
      if (uploadType === "file" && file) {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("subject", formData.subject);
        data.append("file", file);
        await createResource(data as any);
      } else {
        await createResource({
          title: formData.title,
          description: formData.description,
          subject: formData.subject,
          fileUrl: formData.fileUrl,
        });
      }

      setFormData({ title: "", description: "", subject: "", fileUrl: "" });
      setFile(null);
      setShowForm(false);

      // Reload resources
      loadResources();
    } catch (err: unknown) {
      const error = err as {response?: {data?: {message?: string}}};
      setError(error.response?.data?.message || "Failed to upload resource.");
    }
  };

  const getUploaderName = (uploadedBy: Resource["uploadedBy"]): string => {
    if (typeof uploadedBy === "object" && uploadedBy !== null) {
      return uploadedBy.name;
    }
    return "Unknown";
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-blue-600">
          📚 Resource Hub
        </h2>

        {user?.role === "teacher" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="mr-2" size={18} />
            Add Resource
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Upload Form */}
      {showForm && user?.role === "teacher" && (
        <div className="bg-white p-6 rounded-xl shadow mb-8 space-y-4">
          
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setUploadType("file")}
              className={`px-4 py-2 rounded font-medium ${uploadType === "file" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Upload Document (PDF/DOC)
            </button>
            <button
              onClick={() => setUploadType("link")}
              className={`px-4 py-2 rounded font-medium ${uploadType === "link" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              YouTube / Web Link
            </button>
          </div>

          <input
            placeholder="Title"
            value={formData.title}
            onChange={e =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full border p-3 rounded"
          />

          <input
            placeholder="Subject"
            value={formData.subject}
            onChange={e =>
              setFormData({ ...formData, subject: e.target.value })
            }
            className="w-full border p-3 rounded"
          />

          {uploadType === "link" ? (
            <input
              placeholder="Resource Link / YouTube URL"
              value={formData.fileUrl}
              onChange={e =>
                setFormData({ ...formData, fileUrl: e.target.value })
              }
              className="w-full border p-3 rounded"
            />
          ) : (
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
              className="w-full border p-3 rounded bg-white"
            />
          )}

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={e =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border p-3 rounded"
          />

          <button
            onClick={handleAddResource}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Upload Resource
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center mt-16">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          <span className="ml-3 text-gray-600">Loading resources...</span>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center text-gray-500 mt-16">
          No resources available yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(resource => (
            <div
              key={resource._id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold">
                {resource.title}
              </h3>

              <p className="text-sm text-blue-500 mt-1">
                {resource.subject}
              </p>

              <p className="text-gray-600 mt-3 text-sm">
                {resource.description}
              </p>

              <div className="flex justify-between items-center mt-6">
                <a
                  href={resource.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <Download size={16} className="mr-1" />
                  Open
                </a>

                <button
                  onClick={() => {
                    localStorage.setItem('aiContext', JSON.stringify({ title: resource.title, fileUrl: resource.fileUrl }));
                    if (setActiveTab) setActiveTab('chat');
                  }}
                  className="flex items-center text-purple-600 hover:underline ml-4"
                >
                  <Bot size={16} className="mr-1" />
                  Ask in AI
                </button>

                <span className={`px-2 py-1 text-xs rounded-full ${resource.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : resource.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                  {resource.status}
                </span>
              </div>

              <p className="text-xs text-gray-400 mt-3">
                Uploaded by {getUploaderName(resource.uploadedBy)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};