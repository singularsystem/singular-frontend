import { renderHook, act } from "@testing-library/react";
import { usePdfViewerViewModel } from "@/source/view-model/pdf/usePdfViewerViewModel";

describe("usePdfViewerViewModel", () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    URL.createObjectURL = jest.fn(() => "blob:http://localhost:3000/fake-uuid");
    URL.revokeObjectURL = jest.fn();
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(new Blob(["fake pdf content"], { type: "application/pdf" })),
      })
    );
  });

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    jest.restoreAllMocks();
  });

  it("abre com blob: fictícia e revoga a URL ao fechar", async () => {
    const { result } = renderHook(() => usePdfViewerViewModel("doc-123"));

    expect(result.current.isOpen).toBe(false);
    expect(result.current.blobUrl).toBeNull();

    await act(async () => {
      result.current.openViewer("fake-token");
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.blobUrl).toBe("blob:http://localhost:3000/fake-uuid");
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.closeViewer();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.blobUrl).toBeNull();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:http://localhost:3000/fake-uuid");
  });
});
