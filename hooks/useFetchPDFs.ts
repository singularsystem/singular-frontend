import { useSecureFetch } from "@/hooks/useSecureFetch";
import { openPdfInExistingWindow } from "@/lib/pdf-utils";
import { Filters } from "@/types/filters";
import { useCallback, useState } from "react";

export function usePdfPrint() {
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDocumentPdf = useCallback(
    async (documentId: string, win: Window) => {
      setIsPrinting(true);
      setError(null);

      try {
        if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL não definido.");
        const endpoint = `${apiUrl}/api/v1/documents/${documentId}/pdf`;

        await openPdfInExistingWindow(secureFetch, endpoint, win, {
          autoPrint: false,
        });
      } catch (e) {
        if (!win.closed) win.close();
        const msg = e instanceof Error ? e.message : "Erro ao abrir PDF";
        setError(msg);
        throw e;
      } finally {
        setIsPrinting(false);
      }
    },
    [secureFetch, apiUrl],
  );

  const printDocumentPdf = useCallback(
    async (documentId: string, win: Window) => {
      setIsPrinting(true);
      setError(null);

      try {
        if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL não definido.");
        const endpoint = `${apiUrl}/api/v1/documents/${documentId}/pdf`;

        await openPdfInExistingWindow(secureFetch, endpoint, win, {
          autoPrint: true,
        });
      } catch (e) {
        if (!win.closed) win.close();
        const msg = e instanceof Error ? e.message : "Erro ao imprimir";
        setError(msg);
        throw e;
      } finally {
        setIsPrinting(false);
      }
    },
    [secureFetch, apiUrl],
  );

  return { openDocumentPdf, printDocumentPdf, isPrinting, error };
}

function extractFilenameFromDisposition(disposition: string | null) {
  if (!disposition) return null;

  const match = disposition.match(
    /filename\*=UTF-8''([^;]+)|filename="([^"]+)"/i,
  );
  const raw = match?.[1] ?? match?.[2];
  return raw ? decodeURIComponent(raw) : null;
}

export function usePdfDownload() {
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadDocumentPdf = useCallback(
    async (documentId: string) => {
      setIsGeneratingPDF(true);
      setError(null);

      if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL não definido.");

      try {
        const res = await secureFetch(
          `${apiUrl}/api/v1/documents/${documentId}/download`,
          {
            method: "GET",
            headers: { Accept: "application/pdf" },
          },
        );

        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(msg || `Falha ao baixar PDF (${res.status})`);
        }

        const blob = await res.blob();

        const filename =
          extractFilenameFromDisposition(
            res.headers.get("content-disposition"),
          ) ?? `documento-${documentId}.pdf`;

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();

        setTimeout(() => URL.revokeObjectURL(url), 30_000);
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "Ocorreu um erro ao baixar o PDF";
        setError(msg);
        throw e;
      } finally {
        setIsGeneratingPDF(false);
      }
    },
    [secureFetch, apiUrl],
  );

  return { downloadDocumentPdf, isGeneratingPDF, error, setError };
}

export function useStudentsListPdfPrint(filters: Filters) {
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDocumentPdf = useCallback(
    async (win: Window) => {
      setIsPrinting(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.state) params.set("state", filters.state);
      if (filters.city) params.set("city", filters.city);
      if (filters.schoolID) params.set("schoolID", filters.schoolID);
      if (filters.serie) params.set("serie", filters.serie);

      try {
        if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL não definido.");
        const endpoint = `${apiUrl}/api/v1/documents/students/pdf?${params.toString()}`;

        await openPdfInExistingWindow(secureFetch, endpoint, win, {
          autoPrint: false,
        });
      } catch (e) {
        if (!win.closed) win.close();
        const msg = e instanceof Error ? e.message : "Erro ao abrir PDF";
        setError(msg);
        throw e;
      } finally {
        setIsPrinting(false);
      }
    },
    [secureFetch, apiUrl, filters],
  );

  return { openDocumentPdf, isPrinting, error };
}

export function useStudentsListPdfDownload(filters: Filters) {
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadDocumentPdf = useCallback(async () => {
    setIsGeneratingPDF(true);
    setError(null);

    if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL não definido.");

    const params = new URLSearchParams();
    if (filters.state) params.set("state", filters.state);
    if (filters.city) params.set("city", filters.city);
    if (filters.schoolID) params.set("schoolID", filters.schoolID);
    if (filters.serie) params.set("serie", filters.serie);

    try {
      const res = await secureFetch(
        `${apiUrl}/api/v1/documents/students/download?${params.toString()}`,
        {
          method: "GET",
          headers: { Accept: "application/pdf" },
        },
      );

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Falha ao baixar PDF (${res.status})`);
      }

      const blob = await res.blob();

      const filename =
        extractFilenameFromDisposition(
          res.headers.get("content-disposition"),
        ) ?? `documento.pdf`;

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(() => URL.revokeObjectURL(url), 30_000);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Ocorreu um erro ao baixar o PDF";
      setError(msg);
      throw e;
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [secureFetch, apiUrl, filters]);

  return { downloadDocumentPdf, isGeneratingPDF, error, setError };
}

export function useReportsAEEPdfPrint(filters: Filters) {
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDocumentPdf = useCallback(
    async (win: Window) => {
      setIsPrinting(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.state) params.set("state", filters.state);
      if (filters.city) params.set("city", filters.city);
      if (filters.schoolID) params.set("schoolID", filters.schoolID);
      if (filters.disability && filters.disability.length > 0) {
        params.set("disability", filters.disability.join(","));
      }
      if (filters.disorder && filters.disorder.length > 0) {
        params.set("disorder", filters.disorder.join(","));
      }

      try {
        if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL não definido.");
        const endpoint = `${apiUrl}/api/v1/documents/reports-aee/pdf?${params.toString()}`;

        await openPdfInExistingWindow(secureFetch, endpoint, win, {
          autoPrint: false,
        });
      } catch (e) {
        if (!win.closed) win.close();
        const msg = e instanceof Error ? e.message : "Erro ao abrir PDF";
        setError(msg);
        throw e;
      } finally {
        setIsPrinting(false);
      }
    },
    [secureFetch, apiUrl, filters],
  );

  return { openDocumentPdf, isPrinting, error };
}

export function useReportsAEEPdfDownload(filters: Filters) {
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadDocumentPdf = useCallback(async () => {
    setIsGeneratingPDF(true);
    setError(null);

    if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL não definido.");

    const params = new URLSearchParams();
    if (filters.state) params.set("state", filters.state);
    if (filters.city) params.set("city", filters.city);
    if (filters.schoolID) params.set("schoolID", filters.schoolID);
    if (filters.disability && filters.disability.length > 0) {
      params.set("disability", filters.disability.join(","));
    }
    if (filters.disorder && filters.disorder.length > 0) {
      params.set("disorder", filters.disorder.join(","));
    }

    try {
      const res = await secureFetch(
        `${apiUrl}/api/v1/documents/reports-aee/download?${params.toString()}`,
        {
          method: "GET",
          headers: { Accept: "application/pdf" },
        },
      );

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Falha ao baixar PDF (${res.status})`);
      }

      const blob = await res.blob();

      const filename =
        extractFilenameFromDisposition(
          res.headers.get("content-disposition"),
        ) ?? `documento.pdf`;

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(() => URL.revokeObjectURL(url), 30_000);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Ocorreu um erro ao baixar o PDF";
      setError(msg);
      throw e;
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [secureFetch, apiUrl, filters]);

  return { downloadDocumentPdf, isGeneratingPDF, error, setError };
}

export function useFetchSignedDoc() {
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openSignedDocument = useCallback(
    async (documentToken: string | undefined | null) => {
      setIsGeneratingPDF(true);
      setError(null);
      if (!documentToken) return;
      if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL não definido.");

      try {
        const res = await secureFetch(
          `${apiUrl}/api/v1/documents/${documentToken}/signed-url`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
          },
        );

        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(msg || `Falha ao buscar URL (${res.status})`);
        }

        const json = await res.json();

        const signedFile: string | undefined = json?.data?.signedFileUrl;

        if (!signedFile) {
          throw new Error("URL do documento assinado não encontrada.");
        }

        window.open(signedFile, "_blank", "noopener,noreferrer");
        return signedFile;
      } catch (e) {
        const msg =
          e instanceof Error
            ? e.message
            : "Ocorreu um erro ao abrir o documento";
        setError(msg);
        throw e;
      } finally {
        setIsGeneratingPDF(false);
      }
    },
    [secureFetch, apiUrl],
  );

  return { openSignedDocument, isGeneratingPDF, error, setError };
}

export function useCaseStudiesTrackingPdfPrint(filters: Filters) {
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDocumentPdf = useCallback(
    async (win: Window) => {
      setIsPrinting(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.state) params.set("state", filters.state);
      if (filters.city) params.set("city", filters.city);
      if (filters.schoolID) params.set("schoolID", filters.schoolID);
      if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
      if (filters.status) params.set("status", filters.status);
      if (filters.year) params.set("year", filters.year);
      if (filters.month) params.set("month", filters.month);

      try {
        if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL não definido.");
        const endpoint = `${apiUrl}/api/v1/documents/case-studies-tracking/pdf?${params.toString()}`;

        await openPdfInExistingWindow(secureFetch, endpoint, win, {
          autoPrint: false,
        });
      } catch (e) {
        if (!win.closed) win.close();
        const msg = e instanceof Error ? e.message : "Erro ao abrir PDF";
        setError(msg);
        throw e;
      } finally {
        setIsPrinting(false);
      }
    },
    [secureFetch, apiUrl, filters],
  );

  return { openDocumentPdf, isPrinting, error };
}

export function useCaseStudiesTrackingPdfDownload(filters: Filters) {
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadDocumentPdf = useCallback(async () => {
    setIsGeneratingPDF(true);
    setError(null);

    if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL não definido.");

    const params = new URLSearchParams();
    if (filters.state) params.set("state", filters.state);
    if (filters.city) params.set("city", filters.city);
    if (filters.schoolID) params.set("schoolID", filters.schoolID);
    if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
    if (filters.status) params.set("status", filters.status);
    if (filters.year) params.set("year", filters.year);
    if (filters.month) params.set("month", filters.month);

    try {
      const res = await secureFetch(
        `${apiUrl}/api/v1/documents/case-studies-tracking/download?${params.toString()}`,
        {
          method: "GET",
          headers: { Accept: "application/pdf" },
        },
      );

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Falha ao baixar PDF (${res.status})`);
      }

      const blob = await res.blob();

      const filename =
        extractFilenameFromDisposition(
          res.headers.get("content-disposition"),
        ) ?? `Acompanhamento_Estudos_Caso.pdf`;

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(() => URL.revokeObjectURL(url), 30_000);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Ocorreu um erro ao baixar o PDF";
      setError(msg);
      throw e;
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [secureFetch, apiUrl, filters]);

  return { downloadDocumentPdf, isGeneratingPDF, error, setError };
}

export function useBiopsychosocialTrackingPdfPrint(filters: Filters) {
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDocumentPdf = useCallback(
    async (win: Window) => {
      setIsPrinting(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.state) params.set("state", filters.state);
      if (filters.city) params.set("city", filters.city);
      if (filters.schoolID) params.set("schoolID", filters.schoolID);
      if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
      if (filters.status) params.set("status", filters.status);
      if (filters.pendingProfessional) params.set("pendingProfessional", filters.pendingProfessional);
      if (filters.year) params.set("year", filters.year);
      if (filters.month) params.set("month", filters.month);

      try {
        if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL não definido.");
        const endpoint = `${apiUrl}/api/v1/documents/biopsychosocial-tracking/pdf?${params.toString()}`;

        await openPdfInExistingWindow(secureFetch, endpoint, win, {
          autoPrint: false,
        });
      } catch (e) {
        if (!win.closed) win.close();
        const msg = e instanceof Error ? e.message : "Erro ao abrir PDF";
        setError(msg);
        throw e;
      } finally {
        setIsPrinting(false);
      }
    },
    [secureFetch, apiUrl, filters],
  );

  return { openDocumentPdf, isPrinting, error };
}

export function useBiopsychosocialTrackingPdfDownload(filters: Filters) {
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadDocumentPdf = useCallback(async () => {
    setIsGeneratingPDF(true);
    setError(null);

    if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL não definido.");

    const params = new URLSearchParams();
    if (filters.state) params.set("state", filters.state);
    if (filters.city) params.set("city", filters.city);
    if (filters.schoolID) params.set("schoolID", filters.schoolID);
    if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
    if (filters.status) params.set("status", filters.status);
    if (filters.pendingProfessional) params.set("pendingProfessional", filters.pendingProfessional);
    if (filters.year) params.set("year", filters.year);
    if (filters.month) params.set("month", filters.month);

    try {
      const res = await secureFetch(
        `${apiUrl}/api/v1/documents/biopsychosocial-tracking/download?${params.toString()}`,
        {
          method: "GET",
          headers: { Accept: "application/pdf" },
        },
      );

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Falha ao baixar PDF (${res.status})`);
      }

      const blob = await res.blob();

      const filename =
        extractFilenameFromDisposition(
          res.headers.get("content-disposition"),
        ) ?? `Acompanhamento_Biopsicossocial.pdf`;

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(() => URL.revokeObjectURL(url), 30_000);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Ocorreu um erro ao baixar o PDF";
      setError(msg);
      throw e;
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [secureFetch, apiUrl, filters]);

  return { downloadDocumentPdf, isGeneratingPDF, error, setError };
}
