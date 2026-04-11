# Workflow: Critique

UX design review focused on visual hierarchy, clarity, and user experience. Not a technical audit — this is about how it *feels*.

## Input
`$ARGUMENTS` after "critique" — a component, page template, or category to review.

## Steps

### 1. Find and read the target
- Read the component(s) and understand the visual structure
- Consider the context: where does this section appear on a generated website?

### 2. Evaluate

**Visual Hierarchy**
- Is the most important content (headline, CTA) the most prominent?
- Does the eye flow naturally through the layout?
- Are headings, spacing, and weight creating clear sections?
- Is there enough whitespace or is it crowded?

**Clarity**
- Can a visitor understand the section's purpose in 3 seconds?
- Are CTAs clear about what happens when you click?
- Does the component work with various content lengths (short headline vs. long)?
- Are slot constraints (maxLength) appropriate for the layout?

**Consistency**
- Does this match the visual language of other components in the same category?
- Are similar elements styled the same way across components?
- Is spacing consistent with the rest of the library?

**Emotional Resonance**
- Does the component match the `mood[]` tags in its metadata?
- Does the `style[]` tag feel accurate? Would a "modern" tagged component feel modern?
- Are there moments of polish (micro-interactions, thoughtful transitions)?

**Versatility**
- Does the component work with different content types and lengths?
- Does it handle edge cases gracefully (very long text, missing optional slots)?
- Would it look good across different brand palettes (not just the default tokens)?
- Does it pair well with the components listed in `pairsWell`?

### 3. Report

Write a short, opinionated review (not a checklist). Focus on the 2-3 most impactful improvements. For each:
- What's the issue from the visitor's perspective
- Why it matters
- A concrete suggestion

End with what's already working well.
