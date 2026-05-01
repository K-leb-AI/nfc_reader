import { useState, useRef } from "react";
import {
  FiUploadCloud,
  FiFile,
  FiX,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";
import { supabase } from "../../superbaseClient";
import toast from "react-hot-toast";
import { useAuthStore } from "../stores/authStore";
import Papa from "papaparse";
import {
  validateCsvHeaders,
  REQUIRED_HEADERS,
  OPTIONAL_HEADERS,
} from "../validateHeaders";

const parseCSV = (file) =>
  new Promise((resolve, reject) =>
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: reject,
    }),
  );

const BulkModal = () => {
  const { user, company_profile } = useAuthStore();
  const [csv, setCsv] = useState(null);
  const [validation, setValidation] = useState(null); // null | { valid, missing, headers }
  const [checking, setChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  // ── File handling ─────────────────────────────────────
  const processFile = async (file) => {
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      toast.error("Only .csv files are supported.");
      return;
    }

    setCsv(file);
    setChecking(true);
    setValidation(null);

    try {
      const result = await validateCsvHeaders(file);
      setValidation(result);
      if (!result.valid) {
        toast.error(
          `Missing ${result.missing.length} required column${result.missing.length > 1 ? "s" : ""}.`,
        );
      }
    } catch (err) {
      toast.error("Could not read the file.");
      clearFile();
    } finally {
      setChecking(false);
    }
  };

  const clearFile = () => {
    setCsv(null);
    setValidation(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // ── Submit ────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!csv || !validation?.valid) return;
    setIsSaving(true);

    try {
      const rows = await parseCSV(csv);

      console.log(rows);
      const employees = rows.map(
        ({
          name,
          role,
          department,
          email,
          city,
          phone,
          whatsapp,
          linkedin,
          ...rest
        }) => ({
          name,
          role,
          department,
          email,
          city,
          phone,
          whatsapp,
          linkedin,
          company_id: company_profile?.id,
          is_active: true,
        }),
      );

      const { error } = await supabase.from("employee").insert(employees);
      if (error) throw error;

      const { error: activityLogError } = await supabase
        .from("activity_logs")
        .insert({
          event_type: "new_employee",
          employee_id: null, // We don't have individual IDs here, so we can leave this null or handle it differently
          company_id: company_profile.id,
          actor: user.id,
          description_text: `${employees?.length} employee${employees?.length !== 1 ? "s" : ""} were added.`,
        });

      if (activityLogError) throw activityLogError;

      toast.success(
        `${employees.length} employee${employees.length > 1 ? "s" : ""} added!`,
      );
      clearFile();
      // document.getElementById("my_modal_10")?.close();
    } catch (err) {
      console.error(err);
      toast.error(err.message ?? "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Drop zone border colour ───────────────────────────
  const dropzoneBorder = dragging
    ? "border-accent bg-accent/5"
    : validation?.valid
      ? "border-green-500/30 bg-green-500/5"
      : validation && !validation.valid
        ? "border-red-500/30 bg-red-500/5"
        : "border-white/8 bg-white/2 hover:border-accent/40";

  return (
    <dialog
      id="my_modal_10"
      className="modal modal-bottom sm:modal-middle focus:outline-0"
    >
      <div className="modal-box bg-bg-2 rounded-2xl sm:w-[520px] max-w-full flex flex-col gap-5">
        {/* ── Header ── */}
        <div>
          <h3 className="font-bold text-xl">Add Employees in Bulk</h3>
          <p className="text-fg-2/40 text-sm mt-1">
            Upload a CSV file. All required columns must be present before
            importing.
          </p>
        </div>

        {/* ── Drop zone ── */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            processFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => !csv && inputRef.current?.click()}
          className={`rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-3
            ${csv ? "py-5 cursor-default" : "py-10 cursor-pointer"} ${dropzoneBorder}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => processFile(e.target.files?.[0])}
          />

          {!csv ? (
            <>
              <FiUploadCloud size={28} className="text-fg-2/30" />
              <div className="text-center">
                <p className="text-sm font-medium text-fg-2">
                  Drop your CSV here
                </p>
                <p className="text-xs text-fg-2/40 mt-0.5">
                  or click to browse
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 w-full px-4">
              <FiFile size={18} className="text-fg-2/50 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{csv.name}</p>
                <p className="text-xs text-fg-2/40 mt-0.5">
                  {(csv.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="p-1.5 rounded-lg hover:bg-white/8 transition-colors text-fg-2/30 hover:text-fg-2"
              >
                <FiX size={14} />
              </button>
            </div>
          )}

          {checking && (
            <p className="text-xs text-fg-2/40">Checking headers…</p>
          )}
        </div>

        {/* ── Validation feedback ── */}
        {validation && !checking && (
          <div
            className={`rounded-2xl p-4 border ${
              validation.valid
                ? "border-green-500/20 bg-green-500/5"
                : "border-red-400/20 bg-red-400/5"
            }`}
          >
            {validation.valid ? (
              <div className="flex items-start gap-3">
                <FiCheckCircle
                  size={15}
                  className="text-green-400 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="text-sm font-medium text-green-400">
                    All required columns detected
                  </p>
                  <p className="text-xs text-fg-2/40 mt-1">
                    {validation.hasOptionalImgUrl
                      ? "Image URLs found — avatars will be imported."
                      : "No img_url column — initials will be used as avatars."}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {validation.headers.map((h) => (
                      <span
                        key={h}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full tracking-wide ${
                          REQUIRED_HEADERS.includes(h)
                            ? "bg-green-500/15 text-green-400"
                            : OPTIONAL_HEADERS.includes(h)
                              ? "bg-accent/15 text-accent"
                              : "bg-white/8 text-fg-2/40"
                        }`}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <FiAlertTriangle
                  size={15}
                  className="text-red-400 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="text-sm font-medium text-red-400">
                    {validation.missing.length} required column
                    {validation.missing.length > 1 ? "s" : ""} missing
                  </p>
                  <p className="text-xs text-fg-2/40 mt-1">
                    Fix your CSV and re-upload.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {validation.missing.map((h) => (
                      <span
                        key={h}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 tracking-wide"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Required columns reference ── */}
        <div className="rounded-2xl p-4 border border-white/6 bg-white/2">
          <p className="text-[10px] tracking-widest uppercase font-semibold text-fg-2/40 mb-3">
            Required columns
          </p>
          <div className="flex flex-wrap gap-1.5">
            {REQUIRED_HEADERS.map((h) => (
              <span
                key={h}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/6 text-fg-2/50 tracking-wide"
              >
                {h}
              </span>
            ))}
            {OPTIONAL_HEADERS.map((h) => (
              <span
                key={h}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent tracking-wide"
              >
                {h} (optional)
              </span>
            ))}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="modal-action mt-0">
          <form method="dialog" className="w-full">
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  clearFile();
                  document.getElementById("my_modal_10")?.close();
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-white/8 text-fg-2/50 hover:border-white/20 hover:text-fg-2 transition-all duration-150"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                disabled={!validation?.valid || isSaving}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-accent text-bg-2 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isSaving ? "Importing…" : "Import Employees"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Click outside to close */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={clearFile}>close</button>
      </form>
    </dialog>
  );
};

export default BulkModal;
