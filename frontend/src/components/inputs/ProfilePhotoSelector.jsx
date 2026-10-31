import { useEffect, useRef, useState } from "react";
import { FiCamera, FiTrash2, FiUser } from "react-icons/fi";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const onChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
    e.target.value = "";
  };

  return (
    <div className="mb-2 flex justify-center">
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />

      <div className="relative">
        {preview ? (
          <img src={preview} alt="Profile preview" className="h-20 w-20 rounded-full object-cover ring-2 ring-primary" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft text-primary">
            <FiUser size={32} />
          </div>
        )}

        {preview ? (
          <button
            type="button"
            onClick={() => setImage(null)}
            aria-label="Remove photo"
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-expense text-white shadow-glow-expense"
          >
            <FiTrash2 size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-label="Upload photo"
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-glow"
          >
            <FiCamera size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePhotoSelector;
