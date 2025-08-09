import React from "react";
import { useFormStore } from "../state/formStore";
import { uploadImage } from "../api/formApi";
import { FaImage, FaTrash } from "react-icons/fa";

function HeaderImage({ isEditing }) {
  const { form, setForm } = useFormStore();
  const [uploading, setUploading] = React.useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        // Ensure uploadImage returns { data: { imageUrl: ... } }
        const response = await uploadImage(file);
        if (response && response.data && response.data.imageUrl) {
          setForm({ ...form, headerImage: response.data.imageUrl });
        } else {
          alert("Image upload failed: No imageUrl returned.");
        }
      } catch (err) {
        alert("Header image upload failed. Please try again.");
        console.error("Header image upload failed:", err);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setForm({ ...form, headerImage: "" });
  };

  if (!isEditing && !form.headerImage) {
    return null;
  }

  return (
    <div className="relative mb-6 rounded-xl overflow-hidden shadow-2xl animate-fade-in-up">
      {form.headerImage ? (
        <>
          <img
            src={form.headerImage}
            alt="Form Header"
            className="w-full h-48 object-cover transition-all duration-500 hover:scale-105 hover:brightness-110 animate-fade-in"
            style={{ boxShadow: "0 8px 32px 0 rgba(59,130,246,0.18)" }}
          />
          {isEditing && (
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition animate-bounce"
              title="Remove Header Image"
            >
              <FaTrash />
            </button>
          )}
        </>
      ) : (
        isEditing && (
          <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 h-48 flex items-center justify-center border-dashed border-4 border-blue-300 animate-fade-in-up">
            <label className="cursor-pointer bg-blue-500 text-white p-4 rounded-full font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg animate-wiggle relative">
              <FaImage className="inline-block mr-2 animate-bounce" />
              {uploading ? (
                <span className="ml-2 animate-pulse">Uploading...</span>
              ) : (
                <> Upload Header Image </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                tabIndex={-1}
              />
            </label>
          </div>
        )
      )}
      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1.2s ease-in;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .animate-wiggle {
          animation: wiggle 1.2s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce {
          animation: bounce 1.2s infinite;
        }
      `}</style>
    </div>
  );
}

export default HeaderImage;
