import { useState } from "react";
import { getInitials } from "../../utils/helper";

const Avatar = ({ src, name, size = 44, className = "" }) => {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size, fontSize: size * 0.38 };

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name || "Profile"}
        style={style}
        onError={() => setFailed(true)}
        className={`shrink-0 rounded-full object-cover ring-2 ring-primary/60 ${className}`}
      />
    );
  }

  return (
    <div
      style={style}
      className={`flex shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-primary to-balance font-semibold text-white ring-2 ring-primary/40 ${className}`}
    >
      {getInitials(name) || "?"}
    </div>
  );
};

export default Avatar;
