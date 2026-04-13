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
5. Para slots do tipo "list", retorne um array de objetos seguindo o itemSchema descrito.
   - Dentro de listas, slots do tipo "image" tambem devem ser null.
   - Dentro de listas, slots do tipo "url" devem ser preenchidos com ancoras internas relevantes (ex: "#servicos", "#sobre", "#contato", "#pacotes"). Esses sao links de navegacao, nao URLs externos.
6. Para slots do tipo "boolean", retorne true ou false conforme faca sentido para o negocio.
7. Para slots do tipo "number", retorne um numero apropriado dentre as opcoes do enum, se houver.
8. Para slots com "enum", escolha o valor mais adequado ao contexto do negocio.
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
