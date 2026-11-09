# Diretrizes de Arquitetura e Padrões de Layout Obrigatórios (Frontend)

Este documento estabelece a **Constituição Arquitetural e de Layout** que deve ser obrigatoriamente aplicada a todas as telas migradas do sistema IPAAGS para o padrão **MVVM + SOLID**. O objetivo é padronizar a experiência do usuário (IHC), acelerar o desenvolvimento e eliminar retrabalhos nas próximas telas.

---

## 🏛️ 1. Arquitetura Padrão: MVVM + SOLID

Cada funcionalidade do sistema deve ser dividida rigorosamente em quatro camadas, localizadas dentro da pasta `source/`:

```
source/
├── model/                  # Regras de Negócio e Contratos
│   ├── entities/           # Tipagens TypeScript e Validações Estáticas
│   └── repositories/       # Interfaces abstratas de acesso a dados (Ex: IEscolaRepository)
├── infrastructure/         # Comunicação com APIs e Banco
│   └── [modulo]/           # Implementações de repositório e adaptadores (Adapters)
├── view-model/             # Controle de Estado e Lógica de Apresentação
└── view/                   # Componentes React Limpos (Screens e Components)
```

---

## 🎨 2. Padrões de Layout e Componentes Obrigatórios

Todas as telas de listagem e formulários do sistema devem aderir aos seguintes padrões visuais e comportamentais durante a migração:

### 2.1 Preservação de Estado da Tela (`sessionStorage`)
* **Regra**: Nenhuma listagem deve perder o progresso do usuário ao navegar para telas de detalhes/edição e voltar.
* **Implementação**:
  - A ViewModel da listagem deve carregar o estado (página atual, filtros selecionados, termo de busca) de uma chave única no `sessionStorage` no construtor.
  - Qualquer alteração de estado no `updateState` deve persistir esses campos de volta na sessão.
  - A reinicialização da paginação no método `setFilters` só deve ocorrer se **algum valor de filtro de fato mudar**, evitando resets acidentais na primeira montagem da tela.

### 2.2 Seletor de Itens por Página (Page Size Changer)
* **Regra**: Todas as listagens devem conter um seletor visual que permite ao usuário escolher a quantidade de linhas exibidas por página (ex: `10`, `15`, `30`, `50` itens).
* **Posicionamento**: O dropdown de seleção de linhas por página deve ser posicionado no rodapé da listagem, alinhado à esquerda do bloco de paginação.
* **Modelo Visual**:
  ```tsx
  <div className="flex items-center gap-2 text-sm text-gray-500">
    <span>Mostrar</span>
    <Select value={String(pageSize)} onValueChange={(val) => setPageSize(Number(val))}>
      <SelectTrigger className="w-16 h-8">
        <SelectValue placeholder={String(pageSize)} />
      </SelectTrigger>
      <SelectContent>
        {[10, 15, 30, 50].map((size) => (
          <SelectItem key={size} value={String(size)}>{size}</SelectItem>
        ))}
      </SelectContent>
    </Select>
    <span>itens por página</span>
  </div>
  ```

### 2.3 Padronização de Botões e Espaçamentos (IHC)
* **Botão de Conversão Principal ("Novo Aluno", "Nova Escola")**:
  - Deve ser preenchido (`bg-[#111C4E] hover:bg-blue-800 text-white`) e posicionado **sempre no extremo direito** da barra de ações superior.
* **Botões Secundários ("Exportar PDF", "Imprimir", "Baixar Modelo")**:
  - Devem ser desenhados no padrão Outline (`variant="outline"`) e agrupados à esquerda do botão de conversão principal, com espaçamento constante (`gap-2`).
* **Respiro Visual (Escala de 8px)**:
  - Margens internas (paddings) de cards principais unificados em `p-8` (32px) para desktop e `p-6` (24px) para mobile.
  - Gaps de grid configurados in `gap-8` (32px) e distanciamento entre labels e valores em `space-y-2` (8px).

### 2.4 Carregamento Premium (Skeletons)
* **Regra**: É proibido exibir textos crus como "Carregando..." em tabelas principais.
* **Implementação**: Toda tabela em carregamento deve renderizar uma estrutura de Skeletons (`<Skeleton className="h-5 w-32 animate-pulse bg-gray-200" />`) que imita as linhas reais de dados, mantendo a estabilidade do layout durante requisições lentas.

### 2.5 Tratamento de Segurança e Permissões
* **Regra**: Elementos que realizam alterações (Excluir, Editar, Cadastrar) não podem ficar acessíveis a perfis sem permissão.
* **Implementação**:
  - Mapear permissões baseadas em `user.roles` na montagem da tela (`isAdmin`, `isSecretary`, `isPrincipal`, etc.).
  - Diálogos de confirmação de exclusão devem possuir cabeçalhos e botões vermelhos bem contrastados (`variant="destructive"`), de modo a sinalizar ações de risco irrecuperável.

### 2.6 Padrão para Botões de Ação na Tabela (Ações Inline)
* **Regra**: Para reduzir passos cognitivos e cliques desnecessários do usuário (Lei de Fitts / IHC), os botões de ação na tabela (Visualizar, Editar, Excluir) devem ser renderizados **diretamente na linha (inline)** como botões circulares e lado a lado, em vez de ficarem ocultos dentro de um menu dropdown `...` (MoreHorizontal).
* **Posicionamento e Estilos**:
  - Exibir os ícones correspondentes (`Eye`, `Pencil`, `Trash`) usando botões de formato circular com fundo fantasma (`variant="ghost" size="icon" rounded-full h-8 w-8`) e espaçamento sutil (`gap-1`).
  - Cores padrões de destaque no hover:
    - **Visualizar**: Azul (`text-blue-600 hover:text-blue-800 hover:bg-blue-50`)
    - **Editar**: Amarelo/Âmbar (`text-amber-600 hover:text-amber-800 hover:bg-amber-50`)
    - **Excluir**: Vermelho (`text-red-600 hover:text-red-800 hover:bg-red-50`)

