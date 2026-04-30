// utils/validateCsvHeaders.js
import Papa from "papaparse";

export const REQUIRED_HEADERS = [
  "name",
  "role",
  "department",
  "email",
  "city",
  "phone",
  "whatsapp",
  "linkedin",
];

export const OPTIONAL_HEADERS = ["img_url"];

/**
 * Parses only the header row of a CSV file using PapaParse
 * and validates required columns are present.
 *
 * @param {File} file
 * @returns {Promise<{ valid, missing, headers, hasOptionalImgUrl }>}
 */
export const validateCsvHeaders = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      preview: 1, // only parse the first row
      skipEmptyLines: true,
      complete: ({ data, errors }) => {
        if (errors.length) {
          return reject(new Error(errors[0].message));
        }

        if (!data?.length) {
          return resolve({
            valid: false,
            missing: REQUIRED_HEADERS,
            headers: [],
            hasOptionalImgUrl: false,
            error: "The file appears to be empty.",
          });
        }

        // Normalize: lowercase and trim each header
        const headers = data[0].map((h) => h.trim().toLowerCase());
        const missing = REQUIRED_HEADERS.filter((r) => !headers.includes(r));

        resolve({
          valid: missing.length === 0,
          missing,
          headers,
          hasOptionalImgUrl: headers.includes("img_url"),
        });
      },
      error: (err) => reject(new Error(err.message)),
    });
  });
};
