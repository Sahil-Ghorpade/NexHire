import axiosInstance from "../api/axiosInstance";

/**
 * Download PDF from a protected API endpoint
 */
export const downloadPDF = async (
  url,
  filename
) => {
  try {
    const response =
      await axiosInstance.get(
        url,
        {
          responseType:
            "blob",
        }
      );

    // Create blob URL
    const blobUrl =
      window.URL.createObjectURL(
        response.data
      );

    // Create temporary link
    const link =
      document.createElement(
        "a"
      );

    link.href = blobUrl;
    link.download =
      filename;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    // Cleanup
    window.URL.revokeObjectURL(
      blobUrl
    );
  } catch (error) {
    console.error(
      "PDF Download Error:",
      error
    );

    throw new Error(
      "Failed to download report. Please try again."
    );
  }
};