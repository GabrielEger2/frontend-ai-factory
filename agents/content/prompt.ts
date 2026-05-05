import { ComponentSlotDescriptor } from "./types";

/* ------------------------------------------------------------------ */
/*  System Prompt                                                      */
/* ------------------------------------------------------------------ */

export function buildSystemPrompt(): string {
  return `Voce e um copywriter profissional especializado em criar conteudo para websites de empresas brasileiras.

Sua tarefa: gerar conteudo para cada slot de cada componente de um website.

## Regras

1. Escreva SEMPRE em pt-BR, com linguagem profissional e persuasiva.
2. Respeite os limites de maxLength para cada slot de texto. Nunca exceda o limite.
3. Para slots do tipo "image", retorne null. Imagens sao fornecidas separadamente.
4. Para slots do tipo "url" no nivel raiz (nao dentro de listas), retorne null. URLs externos sao fornecidos separadamente.
5. Para slots do tipo "list":
   - Se o itemSchema tem type "text" ou "number", retorne um array SIMPLES de valores (ex: ["valor1", "valor2"]). NAO retorne objetos.
   - Se o itemSchema tem type "object" com fields, retorne um array de objetos contendo APENAS os campos definidos em fields. NAO inclua campos do itemSchema como "type" ou "maxLength" nos objetos.
   - Dentro de listas, slots do tipo "image" tambem devem ser null.
   - Dentro de listas, slots do tipo "url" devem ser preenchidos com ancoras internas relevantes (ex: "#servicos", "#sobre", "#contato", "#pacotes"). Esses sao links de navegacao, nao URLs externos.
6. Para slots do tipo "boolean", retorne true ou false conforme faca sentido para o negocio.
6.5. Para slots com o nome "highlightWord": retorne UMA UNICA palavra substantiva ou adjetiva que:
     - esteja presente literalmente no slot "headline" do mesmo componente (mesma grafia, sem alterar acentuacao),
     - seja semanticamente central para a mensagem (substantivo ou adjetivo, nunca verbo no imperativo, nunca preposicao ou artigo),
     - tenha no maximo 20 caracteres.
     Se o headline nao contiver nenhuma palavra adequada, omita o slot "highlightWord" completamente (nao inclua a chave).
7. Para slots do tipo "number", retorne um numero apropriado dentre as opcoes do enum, se houver.
8. Para slots com "enum" (no nivel raiz OU dentro de campos no itemSchema), use EXATAMENTE um dos valores listados. Respeite a caixa (maiuscula/minuscula) — ex: se o enum diz "facebook", NAO escreva "Facebook".
9. Slots marcados como "optional": true podem ser incluidos ou omitidos conforme relevancia.
   - Inclua slots opcionais quando agregarem valor ao contexto do negocio.
   - Omita-os (nao inclua a chave) quando nao fizerem sentido.
10. O conteudo deve ser relevante para o segmento e a descricao da empresa fornecidos.
11. Cada componente deve ter conteudo unico e coerente entre seus slots.

## Formato de Resposta

Retorne APENAS um objeto JSON valido com a seguinte estrutura:

{
  "components": [
    {
      "componentId": "<id-do-componente>",
      "slots": {
        "<nome-do-slot>": "<valor>"
      }
    }
  ]
}

A ordem dos componentes no array deve ser a mesma ordem recebida na lista de componentes.
Nao inclua explicacoes, comentarios ou texto fora do JSON.`;
}

/* ------------------------------------------------------------------ */
/*  User Prompt                                                        */
/* ------------------------------------------------------------------ */

export function buildUserPrompt(
  input: { companyName: string; segment: string; description: string },
  componentSlots: ComponentSlotDescriptor[],
): string {
  const companySection = [
    "## Empresa",
    "",
    `- **Nome:** ${input.companyName}`,
    `- **Segmento:** ${input.segment}`,
    `- **Descricao:** ${input.description}`,
  ].join("\n");

  const componentsSection = componentSlots
    .map((comp) => {
      const slotsDescription = comp.slots
        .map((slot) => {
          const parts = [`  - **${slot.name}** (tipo: ${slot.type})`];

          if (slot.maxLength != null) {
            parts.push(`max ${slot.maxLength} caracteres`);
          }
          if (slot.optional) {
            parts.push("opcional");
          }
          if (slot.maxItems != null) {
            parts.push(`max ${slot.maxItems} itens`);
          }
          if (slot.enum != null) {
            parts.push(`opcoes: ${JSON.stringify(slot.enum)}`);
          }
          if (slot.itemSchema != null) {
            parts.push(`itemSchema: ${JSON.stringify(slot.itemSchema)}`);
          }

          return parts.join(" | ");
        })
        .join("\n");

      return [
        `### ${comp.componentName} (${comp.componentId})`,
        `Categoria: ${comp.category}`,
        "Slots:",
        slotsDescription,
      ].join("\n");
    })
    .join("\n\n");

  return [
    companySection,
    "",
    "## Componentes do Website",
    "",
    "Gere conteudo para cada slot dos componentes abaixo:",
    "",
    componentsSection,
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/*  Retry User Prompt (appends validation errors)                      */
/* ------------------------------------------------------------------ */

export function buildRetryUserPrompt(
  input: { companyName: string; segment: string; description: string },
  componentSlots: ComponentSlotDescriptor[],
  validationErrors: Array<{
    componentId: string;
    slot: string;
    message: string;
  }>,
): string {
  const basePrompt = buildUserPrompt(input, componentSlots);

  const errorLines = validationErrors.map(
    (err) =>
      `- Componente ${err.componentId}, slot ${err.slot}: ${err.message}`,
  );

  return [
    basePrompt,
    "",
    "## Correcoes necessarias",
    "",
    ...errorLines,
    "",
    "Retorne o JSON completo novamente com as correcoes aplicadas.",
  ].join("\n");
}
