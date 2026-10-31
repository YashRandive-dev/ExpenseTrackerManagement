// Lightweight user-agent parsing (no dependency) for the "logged-in devices" list.
exports.parseDevice = (req) => {
  const ua = req.headers["user-agent"] || "";

  let browser = "Unknown browser";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/OPR\/|Opera/.test(ua)) browser = "Opera";
  else if (/Chrome\//.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua)) browser = "Safari";

  let os = "Unknown OS";
  if (/Windows/.test(ua)) os = "Windows";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
  else if (/Mac OS X|Macintosh/.test(ua)) os = "macOS";
  else if (/Linux/.test(ua)) os = "Linux";

  const mobile = /Mobile|Android|iPhone|iPad/.test(ua);
  return {
    browser,
    os,
    deviceName: `${browser} on ${os}${mobile ? " (mobile)" : ""}`,
    ip: (req.ip || "").replace(/^::ffff:/, ""),
  };
};
