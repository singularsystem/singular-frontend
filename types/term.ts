export type TermResponse = {
  id: string;
  key: string;
  version: string;
  title: string;
  content: string;
  contentFormat: "markdown" | "html";
  publishedAt: string;
  contentHash: string;
};

export type ActiveTermStatusResponse = {
  hasAccepted: boolean;
  acceptedAt?: string | null;
  termVersion?: string | null;
  termId?: string | null;
};
