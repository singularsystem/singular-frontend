export function renderTermTemplate(
  content: string,
  data: Record<string, string | undefined | null>,
) {
  return content.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = data[key];
    return (value ?? "").toString();
  });
}
