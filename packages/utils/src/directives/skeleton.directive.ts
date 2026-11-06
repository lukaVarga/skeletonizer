import { SkeletonizedDataEnum, SkeletonizerColorSchemaEnum } from '../constants';
import type { ISkeletonizerColorSchema } from '../types';

export class SkeletonDirective {
  public static readonly dataAttr: string = 'data-skeletonizer';

  private static readonly formControlDataAttrs: Partial<Record<string, SkeletonizedDataEnum>> = {
    input: SkeletonizedDataEnum.Input,
    textarea: SkeletonizedDataEnum.Input,
    select: SkeletonizedDataEnum.Select,
  };

  public static skeletonizeProjectedTemplate(template: HTMLElement, colorSchema?: ISkeletonizerColorSchema): void {
    // Skip processing in SSR context to prevent hydration mismatches
    if (!this.isBrowser()) {
      return;
    }

    const primaryColor: string = colorSchema?.primaryColor ?? SkeletonizerColorSchemaEnum.PrimaryColor;
    const secondaryColor: string = colorSchema?.secondaryColor ?? SkeletonizerColorSchemaEnum.SecondaryColor;

    template.setAttribute(
      'style',
      `--skeletonizer-primary-color: ${primaryColor}; --skeletonizer-secondary-color: ${secondaryColor};`,
    );

    Array.from<HTMLElement>(template.querySelectorAll('*:not(svg, [data-skeletonizer])'))
      // form controls' contents (textarea value, select options) must not be wrapped into skeletonized spans
      .filter((el: HTMLElement) => !el.matches('textarea') && !el.closest('textarea, select'))
      .forEach((el: HTMLElement) => {
        const ignoredNodes: string[] = [
          'br',
          'b',
          'strong',
          'i',
          'em',
          'mark',
          'small',
          'del',
          'ins',
          'sub',
          'sup',
        ];

        const nodeNames: string[] = Array.from(el.childNodes)
          .map((node: ChildNode) => node.nodeName.toLowerCase())
          .filter((name: string) => !ignoredNodes.includes(name));

        const elementHasMixedNodes: boolean = nodeNames.length > 0 && nodeNames.some((name: string) => name !== nodeNames[0]);

        el.childNodes
          .forEach((childNode: ChildNode) => {
            switch (childNode.nodeName.toLowerCase()) {
              case '#text': {
                this.assertAs<Text>(childNode);

                // prevent reacting to shadow elements
                if (!!childNode.wholeText.trim()) {
                  if (elementHasMixedNodes) {
                    const pseudoElement: HTMLSpanElement = document.createElement('span');
                    pseudoElement.innerText = (childNode.cloneNode() as Text).wholeText;

                    if (pseudoElement.innerText.length) {
                      childNode.replaceWith(
                        SkeletonDirective.skeletonizedSpanGenerator(pseudoElement.innerText, SkeletonizedDataEnum.Text),
                      );
                    }
                  } else {
                    const span: HTMLSpanElement = SkeletonDirective.skeletonizedSpanGenerator(el.innerHTML, SkeletonizedDataEnum.Text);
                    el.innerHTML = span.outerHTML;
                  }
                }

                break;
              }

              case 'img': {
                (childNode as HTMLImageElement).setAttribute(SkeletonDirective.dataAttr, SkeletonizedDataEnum.Image);

                break;
              }

              case 'video': {
                (childNode as HTMLVideoElement).setAttribute(SkeletonDirective.dataAttr, SkeletonizedDataEnum.Video);

                break;
              }
            }
          });
      });

    SkeletonDirective.skeletonizeFormControls(template);

    template.setAttribute(SkeletonDirective.dataAttr, SkeletonizedDataEnum.WrapperElement);
  }

  // handled separately from the child-node walk so that controls placed directly in the template are covered too
  private static skeletonizeFormControls(template: HTMLElement): void {
    Array.from<HTMLElement>(template.querySelectorAll('input, textarea, select, button'))
      .forEach((el: HTMLElement) => {
        const dataAttrValue: SkeletonizedDataEnum | undefined = SkeletonDirective.formControlDataAttrs[el.nodeName.toLowerCase()];

        if (dataAttrValue) {
          el.setAttribute(SkeletonDirective.dataAttr, dataAttrValue);
        }

        el.setAttribute('disabled', '');
        el.setAttribute('tabindex', '-1');
      });
  }

  private static skeletonizedSpanGenerator(text: string, nodeType: SkeletonizedDataEnum): HTMLSpanElement {
    const span: HTMLSpanElement = document.createElement('span');
    span.innerHTML = text;

    span.setAttribute(SkeletonDirective.dataAttr, nodeType);

    return span;
  }

  private static isBrowser(): boolean {
    return typeof document !== 'undefined';
  }

  private static assertAs<Type>(_arg: unknown): asserts _arg is Type {}
}
