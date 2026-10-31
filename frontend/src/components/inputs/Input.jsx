import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Input = ({ label, type = "text", error, className = "", ...props }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <label className={`block ${className}`}>
      {label && <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>}
      <div className="relative">
        <input
          type={isPassword && show ? "text" : type}
          className={`field ${isPassword ? "pr-11" : ""} ${error ? "field-error" : ""}`}
          aria-invalid={!!error}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-ink"
          >
            {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>
      {error && <span className="mt-1 block text-xs text-expense">{error}</span>}
    </label>
  );
};

export default Input;
