from bs4 import BeautifulSoup
import json

INPUT_HTML = r"C:\Users\orran\Downloads\PEI\PEI\MATEMATICA\MATEMATICA_9ano.html"
OUTPUT_JSON = (
    r"C:\Users\orran\Documents\GitHub\singular-frontend\lib\MATEMATICA_9ano.json"
)


def ul_to_text(ul):
    if not ul:
        return ""
    items = [li.get_text(" ", strip=True) for li in ul.select("li")]
    return "\n".join(items)


with open(INPUT_HTML, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f.read(), "html.parser")

result = []
for card in soup.select("section.card"):
    habil = card.select_one("div.habil")
    if not habil:
        continue

    code_span = habil.select_one("span.code")
    _id = code_span.get_text(strip=True) if code_span else ""

    # pergunta = texto do .habil sem o span.code
    habil_clone = BeautifulSoup(str(habil), "html.parser")
    span_clone = habil_clone.select_one("span.code")
    if span_clone:
        span_clone.extract()
    pergunta = habil_clone.get_text(" ", strip=True)

    ok_ul = card.select_one("div.col.ok ul")
    no_ul = card.select_one("div.col.no ul")

    result.append(
        {
            "id": _id,
            "pergunta": pergunta,
            "tipo": "",  # se quiser, preencha aqui
            "sugestaoSimComMediacao": ul_to_text(ok_ul),
            "sugestaoNao": ul_to_text(no_ul),
        }
    )

with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"Gerado: {OUTPUT_JSON} ({len(result)} itens)")
