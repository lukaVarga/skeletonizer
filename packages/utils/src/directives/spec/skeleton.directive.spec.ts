import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SkeletonDirective } from '../skeleton.directive';
import { SkeletonizedDataEnum, SkeletonizerColorSchemaEnum } from '../../constants';

describe('SkeletonDirective', () => {
  describe('skeletonizeProjectedTemplate', () => {
    let html: HTMLElement;

    beforeEach(() => {
      html = document.createElement('div');

      html.innerHTML = `
Outer text
<div>
    <div>
        <h1>Some header text</h1>
        <p>Some <em>paragraph</em> text<br/><br/>Divided by BRs</p>
        <div>Some text <strong>inside</strong> the <i>div</i></div>
        <div>Some <b>text</b> <mark>that</mark> <small>is</small> <del>made</del> <ins>of</ins> <sub>different</sub> <sup>styles</sup></div>
    </div>
    <div>
        Some text that is not wrapped in isolated elements
        <input type="text" />
    </div>
    <!-- some shadow element -->
    <div><img src="img.jpg"></div>
    <div><video src="video.mp4"></video></div>

    <svg><use xlink:href="/link-to-svg-sprite#icon-id"></use></svg>
</div>
      `;
    });

    describe('SSR context', () => {
      let originalDocument: typeof document;
      let ssrHtml: HTMLElement;
      let originalInnerHTML: string;

      beforeEach(() => {
        // Create the element before we remove document
        ssrHtml = document.createElement('div');

        ssrHtml.innerHTML = `
<div>
    <h1>Header text</h1>
    <div><img src="img.jpg"></div>
    <div><video src="video.mp4"></video></div>
    <div><input type="text" /></div>
</div>
        `;

        originalInnerHTML = ssrHtml.innerHTML;

        originalDocument = globalThis.document;
        // Simulate SSR environment by making document undefined
        // @ts-expect-error - intentionally setting document to undefined for SSR simulation
        delete globalThis.document;
      });

      afterEach(() => {
        // Restore document after test
        globalThis.document = originalDocument;
      });

      it('skips processing entirely in SSR context to prevent hydration mismatches', () => {
        expect(() => {
          SkeletonDirective.skeletonizeProjectedTemplate(ssrHtml);
        }).not.toThrow();

        // Verify no modifications were made to the template
        expect(ssrHtml.innerHTML).toEqual(originalInnerHTML);
        expect(ssrHtml.getAttribute('data-skeletonizer')).toBeNull();
        expect(ssrHtml.getAttribute('style')).toBeNull();
      });
    });

    describe('outer element', () => {
      it('sets skeletonized data attribute with wrapper element value to the outer element', () => {
        SkeletonDirective.skeletonizeProjectedTemplate(html);

        expect(html.getAttribute('data-skeletonizer')).toEqual(SkeletonizedDataEnum.WrapperElement);
      });

      describe('when called without color schema', () => {
        it('sets primary and secondary color CSS variables based on default values', () => {
          SkeletonDirective.skeletonizeProjectedTemplate(html);

          const expectedStyle: string =
            `--skeletonizer-primary-color: ${SkeletonizerColorSchemaEnum.PrimaryColor}; ` +
            `--skeletonizer-secondary-color: ${SkeletonizerColorSchemaEnum.SecondaryColor};`;

          expect(html.getAttribute('style')).toEqual(expectedStyle);
        });
      });

      describe('when called with color schema', () => {
        it('sets primary and secondary color CSS variables based on provided values', () => {
          const primaryColor: string = 'rgba(244, 53, 23, 0.7';
          const secondaryColor: string = 'rgba(200, 80, 77, 0.2';

          SkeletonDirective.skeletonizeProjectedTemplate(html, { primaryColor, secondaryColor });

          const expectedStyle: string =
            `--skeletonizer-primary-color: ${primaryColor}; ` +
            `--skeletonizer-secondary-color: ${secondaryColor};`;

          expect(html.getAttribute('style')).toEqual(expectedStyle);
        });
      });
    });

    describe('inner elements', () => {
      it('transforms the DOM by wrapping elements with spans and setting attributes', () => {
        SkeletonDirective.skeletonizeProjectedTemplate(html);

        const expectedInnerHTML: string = `Outer text
<div>
    <div>
        <h1><span data-skeletonizer="text">Some header text</span></h1>
        <p><span data-skeletonizer="text">Some <em>paragraph</em> text<br><br>Divided by BRs</span></p>
        <div><span data-skeletonizer="text">Some text <strong>inside</strong> the <i>div</i></span></div>
        <div><span data-skeletonizer="text">Some <b>text</b> <mark>that</mark> <small>is</small> `
          + `<del>made</del> <ins>of</ins> <sub>different</sub> <sup>styles</sup></span></div>
    </div>
    <div><span data-skeletonizer="text">
        Some text that is not wrapped in isolated elements
        </span><input type="text" data-skeletonizer="input">
    </div>
    <!-- some shadow element -->
    <div><img src="img.jpg" data-skeletonizer="image"></div>
    <div><video src="video.mp4" data-skeletonizer="video"></video></div>

    <svg><use xlink:href="/link-to-svg-sprite#icon-id"></use></svg>
</div>`;

        expect(html.innerHTML.trim()).toEqual(expectedInnerHTML);
      });
    });
  });
});
