import { useState, useCallback, useEffect } from "react";

export function usePdfViewerViewModel(documentId: string, initialIsOpen = false) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanup = useCallback(() => {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }
  }, [blobUrl]);

  const loadPdf = useCallback(
    async (profile: "view" | "print" = "view", token?: string) => {
      setIsLoading(true);
      setError(null);
      cleanup();

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const authToken = token || localStorage.getItem("token") || "";

        const res = await fetch(`${apiUrl}/api/v1/documents/${documentId}/pdf?profile=${profile}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Erro ao carregar visualização do documento (${res.status})`);
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } catch (err: any) {
        setError(err.message || "Não foi possível carregar o documento");
      } finally {
        setIsLoading(false);
      }
    },
    [documentId, cleanup]
  );

  const openViewer = useCallback(
    (token?: string) => {
      setIsOpen(true);
      loadPdf("view", token);
    },
    [loadPdf]
  );

  const closeViewer = useCallback(() => {
    setIsOpen(false);
    cleanup();
  }, [cleanup]);

  const handlePrint = useCallback(
    (token?: string) => {
      loadPdf("print", token);
    },
    [loadPdf]
  );

  const handleDownload = useCallback(() => {
    if (!blobUrl) return;
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `documento-${documentId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [blobUrl, documentId]);

  const handleOpenInNewTab = useCallback(() => {
    if (!blobUrl) return;
    window.open(blobUrl, "_blank");
  }, [blobUrl]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isOpen,
    blobUrl,
    isLoading,
    error,
    openViewer,
    closeViewer,
    handlePrint,
    handleDownload,
    handleOpenInNewTab,
  };
}
