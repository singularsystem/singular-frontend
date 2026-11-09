"use client";

// Função alternativa para gerar PDF usando a API do navegador
export function generatePDFAlternative(elementId: string, filename: string) {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id ${elementId} not found`);
      return false;
    }

    // Criar um novo documento HTML para impressão
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Por favor, permita pop-ups para gerar o PDF");
      return false;
    }

    // Adicionar o conteúdo ao documento
    printWindow.document.write(`
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0;
              padding: 20px;
            }
            .print-container { 
              max-width: 800px;
              margin: 0 auto;
            }
            h1, h2, h3, h4 { 
              color: #333;
              margin-top: 20px; 
            }
            p { 
              margin-bottom: 10px; 
              line-height: 1.5;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 10px;
              border-bottom: 1px solid #ccc;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 10px;
              border-top: 1px solid #ccc;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="header">
              <h1>Instituto Piauiense de Assistência, Auditoria e Gestão em Saúde</h1>
              <h2>Relatório Biopsicossocial</h2>
            </div>
            ${element.innerHTML}
            <div class="footer">
              <p>Relatório gerado em ${new Date().toLocaleDateString(
                "pt-BR"
              )} às ${new Date().toLocaleTimeString("pt-BR")}</p>
              <p>Sistema AEE - IPAAGS</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
              }, 500);
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
}
