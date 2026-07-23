export const SITE_URL = "https://askyourdocs.app";
export const SITE_NAME = "AskYourDocs";
export const SITE_DESCRIPTION =
  "Upload a PDF or Word document and chat with an AI that answers grounded in its content.";

export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — chat with your documents`,
};

export const NOINDEX = {
  index: false,
  follow: false,
} as const;
