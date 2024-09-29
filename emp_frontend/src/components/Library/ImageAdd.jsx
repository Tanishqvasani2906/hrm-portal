import { useState, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Film } from "lucide-react";
import { app } from "../../../firebase";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const db = getFirestore(app);
const storage = getStorage(app);

const ImageAdd = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [dates, setDates] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentUploads();
  }, []);

  const fetchRecentUploads = async () => {
    try {
      const q = query(
        collection(db, "uploads"),
        orderBy("uploadedAt", "desc"),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const files = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUploadedFiles(files);
    } catch (err) {
      console.error("Error fetching recent uploads:", err);
      setError("Failed to fetch recent uploads. Please try again later.");
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    setDescriptions(new Array(files.length).fill(""));
    setDates(new Array(files.length).fill(""));
  };

  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
  };

  const handleDateChange = (index, value) => {
    const newDates = [...dates];
    newDates[index] = value;
    setDates(newDates);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUploading(true);
    setError(null);

    try {
      const uploadPromises = selectedFiles.map(async (file, index) => {
        const storageRef = ref(storage, `uploads/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done`);
            },
            (error) => {
              console.error("Upload failed", error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              const fileData = {
                url: downloadURL,
                name: file.name,
                type: file.type,
                description: descriptions[index],
                date: dates[index],
                uploadedAt: new Date(),
              };

              await addDoc(collection(db, "uploads"), fileData);
              resolve(fileData);
            }
          );
        });
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setUploadedFiles((prevFiles) => [...uploadedFiles, ...prevFiles]);
      setSelectedFiles([]);
      setPreviewUrls([]);
      setDescriptions([]);
      setDates([]);
    } catch (err) {
      console.error("Error uploading files", err);
      setError("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removePreview = (index) => {
    setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setDescriptions((prevDesc) => prevDesc.filter((_, i) => i !== index));
    setDates((prevDates) => prevDates.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-[#01008A]">
        Image & Video Library
      </h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-[#00A189] text-white py-3 px-6 rounded-md inline-flex items-center hover:bg-[#008c76] transition-colors"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Images or Videos
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {previewUrls.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <div className="relative group mb-2">
                  <div className="aspect-w-16 aspect-h-9">
                    {selectedFiles[index].type.startsWith("image/") ? (
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <video
                        src={url}
                        className="w-full h-full object-cover rounded-md"
                      />
                    )}
                  </div>
                  <button
                    onClick={() => removePreview(index)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4 text-[#707070]" />
                  </button>
                  {selectedFiles[index].type.startsWith("image/") ? (
                    <ImageIcon className="absolute bottom-1 left-1 w-5 h-5 text-white" />
                  ) : (
                    <Film className="absolute bottom-1 left-1 w-5 h-5 text-white" />
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Enter description"
                  value={descriptions[index]}
                  onChange={(e) =>
                    handleDescriptionChange(index, e.target.value)
                  }
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="date"
                  value={dates[index]}
                  onChange={(e) => handleDateChange(index, e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={previewUrls.length === 0 || uploading}
          className={`w-full py-3 px-6 rounded-md text-white font-medium ${
            previewUrls.length === 0 || uploading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#01008A] hover:bg-[#00006b] transition-colors"
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {uploadedFiles.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-[#01008A]">
            Recent Uploads
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="border rounded-lg p-4">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-32 object-cover rounded-lg shadow-md mb-2"
                />
                <p className="text-sm text-[#707070] mb-1">
                  {file.description}
                </p>
                <p className="text-sm text-[#707070]">
                  {new Date(file.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageAdd;
