import React, { useState, useRef } from "react";
import { ArrowLeft, ImagePlus, X, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { createThread, type CreateThreadPayload } from "@/api/thread";

type ImagePreview = {
  id: number;
  url: string;
  name: string;
};

export default function CreateThreadPage() {
  const [content, setContent] = useState("");
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newPreviews: ImagePreview[] = [];
    let filesProcessed = 0;

    const filesArray = Array.from(files);

    filesArray.forEach((file, i) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push({
          id: Date.now() + i,
          url: reader.result as string,
          name: file.name,
        });
        filesProcessed++;
        if (filesProcessed === filesArray.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
          setImageFiles((prev) => [...prev, ...filesArray]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (id: number) => {
    setImagePreviews((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index !== -1) {
        setImageFiles((files) => {
          const newFiles = [...files];
          newFiles.splice(index, 1);
          return newFiles;
        });
        const newPreviews = [...prev];
        newPreviews.splice(index, 1);
        return newPreviews;
      }
      return prev;
    });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!content.trim()) {
      alert("Please fill in both the title and content.");
      return;
    }
    const payload: CreateThreadPayload = {
      content,
      images: imageFiles,
    };
    try {
      console.log('going to send to backend')
      const thread = await createThread(payload);
      setSuccessMessage(`Thread created with ID: ${thread.id}`);
      setContent("");
      setImagePreviews([]);
    } catch (err) {
      console.error(err);
      setError("Failed to create thread.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="">
        <div className="max-w-4xl mx-auto flex items-center">
          <Link
            to="/forum"
            className="text-gray-500 hover:text-[#9188f1] p-2 rounded-full mr-2"
          >
            <ArrowLeft size={24} />
          </Link>
        </div>
      </header>

      <main className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-[0px_3px_0px_0px_rgb(221,216,212)] space-y-6">
            {error && (
              <div className="text-red-600 bg-red-100 p-3 rounded mb-4">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="text-green-600 bg-green-100 p-3 rounded mb-4">
                {successMessage}
              </div>
            )}

            <div>
              <label
                htmlFor="post-content"
                className="text-lg font-bold text-gray-800 mb-2 block"
              >
                Your Content
              </label>
              <textarea
                id="post-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts, ask a question, or tell a story..."
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#9188f1] focus:ring-1 focus:ring-[#9188f1]/50 outline-none transition resize-none"
                rows={8}
              ></textarea>
            </div>

            <div>
              <label className="text-lg font-bold text-gray-800 mb-2 block">
                Attach Images (Optional)
              </label>
              <div
                onClick={triggerFileInput}
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#9188f1] hover:bg-gray-50 transition"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  multiple
                  accept="image/png, image/jpeg, image/gif"
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <ImagePlus size={40} className="mb-2" />
                  <p className="font-semibold">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm">PNG, JPG, GIF</p>
                </div>
              </div>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((img) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              className="bg-white text-gray-700 font-bold px-8 py-3 rounded-full border-2 border-gray-200 shadow-[0px_2px_0px_0px_rgb(221,216,212)] transition-transform hover:-translate-y-0.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`... ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                "Posting..."
              ) : (
                <>
                  <span>Post Thread</span>
                  <Send size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
