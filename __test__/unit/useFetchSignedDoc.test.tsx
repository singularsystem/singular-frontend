import { act, renderHook } from "@testing-library/react";

// Validates: Requirement 10.6
//
// openSignedDocument deve consumir o campo `signedFileUrl` do novo endpoint
// agnóstico, chamar window.open com a URL e retornar a URL.

// Mock do módulo @/hooks/useSecureFetch: secureFetch é injetado por este mock
// para que o teste controle a resposta do fetch sem rede nem contexto de auth.
const secureFetchMock = jest.fn();

jest.mock("@/hooks/useSecureFetch", () => ({
  useSecureFetch: () => ({ secureFetch: secureFetchMock }),
}));

import { useFetchSignedDoc } from "@/hooks/useFetchPDFs";

const API_URL = "https://api.test.local";

describe("useFetchSignedDoc.openSignedDocument", () => {
  let openSpy: jest.SpyInstance;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = API_URL;
    secureFetchMock.mockReset();
    // jsdom não implementa window.open — fornece um stub antes de espiá-lo.
    openSpy = jest
      .spyOn(window, "open")
      .mockImplementation(() => null as unknown as Window);
  });

  afterEach(() => {
    openSpy.mockRestore();
  });

  it("faz parse de signedFileUrl, abre a aba com a URL e retorna a URL", async () => {
    const signedFileUrl = "https://files.test.local/signed/doc-123.pdf";
    const documentToken = "token-abc-123";

    secureFetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { signedFileUrl } }),
    });

    const { result } = renderHook(() => useFetchSignedDoc());

    let returned: string | undefined;
    await act(async () => {
      returned = await result.current.openSignedDocument(documentToken);
    });

    // Chamou o endpoint agnóstico via secureFetch.
    expect(secureFetchMock).toHaveBeenCalledWith(
      `${API_URL}/api/v1/documents/${documentToken}/signed-url`,
      expect.objectContaining({ method: "GET" }),
    );

    // window.open chamado com a URL exata e as flags corretas.
    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy).toHaveBeenCalledWith(
      signedFileUrl,
      "_blank",
      "noopener,noreferrer",
    );

    // A função retorna a mesma URL.
    expect(returned).toBe(signedFileUrl);
  });

  // Validates: Requirement 10.7 (e 7.4)
  //
  // Sem `signedFileUrl` na resposta OK → openSignedDocument lança erro neutro
  // e não abre nenhuma aba, de modo a disparar o fallback dos chamadores.
  it("lança erro quando a resposta OK não contém signedFileUrl, sem abrir aba", async () => {
    const documentToken = "token-sem-url";

    secureFetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: {} }),
    });

    const { result } = renderHook(() => useFetchSignedDoc());

    await act(async () => {
      await expect(
        result.current.openSignedDocument(documentToken),
      ).rejects.toThrow("URL do documento assinado não encontrada.");
    });

    // Fallback: nenhuma aba foi aberta.
    expect(openSpy).not.toHaveBeenCalled();
  });

  // Validates: Requirement 10.7 (e 7.4)
  //
  // Falha HTTP (res.ok === false) → openSignedDocument lança erro e não abre
  // nenhuma aba, de modo a disparar o fallback dos chamadores.
  it("lança erro quando a requisição falha (res.ok=false), sem abrir aba", async () => {
    const documentToken = "token-http-500";

    secureFetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "",
    });

    const { result } = renderHook(() => useFetchSignedDoc());

    await act(async () => {
      await expect(
        result.current.openSignedDocument(documentToken),
      ).rejects.toThrow("Falha ao buscar URL (500)");
    });

    // Fallback: nenhuma aba foi aberta.
    expect(openSpy).not.toHaveBeenCalled();
  });
});
