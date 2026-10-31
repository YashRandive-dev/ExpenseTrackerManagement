import { motion } from "framer-motion";
import Spinner from "../common/Spinner";

const DeleteAlert = ({ content, onDelete, onCancel, loading = false }) => (
  <div>
    <p className="text-sm text-muted">{content}</p>
    <div className="mt-6 flex justify-end gap-3">
      <button type="button" className="btn-ghost" onClick={onCancel} disabled={loading}>
        Cancel
      </button>
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        className="btn-danger"
        onClick={onDelete}
        disabled={loading}
      >
        {loading ? <Spinner /> : "Delete"}
      </motion.button>
    </div>
  </div>
);

export default DeleteAlert;
