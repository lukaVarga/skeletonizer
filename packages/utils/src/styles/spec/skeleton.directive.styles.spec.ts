// @vitest-environment node
import { describe, expect, it } from 'vitest';
import * as path from 'path';
import { compile } from 'sass';

describe('skeleton directive styles', () => {
  const css: string = compile(path.resolve(__dirname, '../index.scss')).css;

  // the declarations of the rule that paints a skeletonized text element
  function textElementDeclarations(): string {
    const rule: RegExpExecArray | null = /\[data-skeletonizer=wrapper-element\] \[data-skeletonizer=text\]\s*\{([^}]*)\}/.exec(css);

    return rule?.[1] ?? '';
  }

  describe('text element', () => {
    it('keeps its text transparent so that the placeholder data cannot be read', () => {
      expect(textElementDeclarations()).toMatch(/\bcolor:\s*rgba\(0,\s*0,\s*0,\s*0\)\s*!important/);
    });

    // forced colors (e.g. a high contrast mode) would otherwise replace the bar with the page color and make the text readable
    it('opts out of forced colors so that the bar stays visible and its text transparent', () => {
      expect(textElementDeclarations()).toMatch(/\bforced-color-adjust:\s*none\b/);
    });
  });
});
