export const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    GET_USER: "/api/v1/auth/getUser",
    UPLOAD_IMAGE: "/api/v1/auth/upload-image",
    VERIFY_EMAIL: "/api/v1/auth/verify-email",
    RESEND_OTP: "/api/v1/auth/resend-otp",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    RESET_PASSWORD: "/api/v1/auth/reset-password",
    PROFILE: "/api/v1/auth/profile",
    CHANGE_PASSWORD: "/api/v1/auth/change-password",
    LOGOUT: "/api/v1/auth/logout",
    SESSIONS: "/api/v1/auth/sessions",
    SESSION: (id) => `/api/v1/auth/sessions/${id}`,
  },
  DASHBOARD: {
    GET_DATA: "/api/v1/dashboard",
  },
  INCOME: {
    ADD: "/api/v1/income/add",
    GET_ALL: "/api/v1/income/get",
    DELETE: (id) => `/api/v1/income/${id}`,
    DOWNLOAD: "/api/v1/income/downloadexcel",
  },
  EXPENSE: {
    ADD: "/api/v1/expense/add",
    GET_ALL: "/api/v1/expense/get",
    DELETE: (id) => `/api/v1/expense/${id}`,
    DOWNLOAD: "/api/v1/expense/downloadexcel",
  },
};
