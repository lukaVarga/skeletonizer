import { Component, OnInit } from '@angular/core';
import { SchemaItem, SkeletonAbstractComponent, TSchemaConfig } from '@skeletonizer/utils';
import { DomSanitizer } from '@angular/platform-browser';

interface IResource {
  title: string;
  link: string;
  svg: string;
}

const learnNgSvg: string = '<svg class="material-icons" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>';

const cliDocsSvg: string = '<svg class="material-icons" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>';

const angularMaterialSvg: string = '<svg xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px" width="21.813" height="23.453" viewBox="0 0 179.2 192.7"><path fill="#ffa726" d="M89.4 0 0 32l13.5 118.4 75.9 42.3 76-42.3L179.2 32 89.4 0z"/><path fill="#fb8c00" d="M89.4 0v192.7l76-42.3L179.2 32 89.4 0z"/><path fill="#ffe0b2" d="m102.9 146.3-63.3-30.5 36.3-22.4 63.7 30.6-36.7 22.3z"/><path fill="#fff3e0" d="M102.9 122.8 39.6 92.2l36.3-22.3 63.7 30.6-36.7 22.3z"/><path fill="#fff" d="M102.9 99.3 39.6 68.7l36.3-22.4 63.7 30.6-36.7 22.4z"/></svg>';

const angularBlogSvg: string = '<svg class="material-icons" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>';

const angularDevtoolsSvg: string = '<svg class="material-icons" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M14.73,13.31C15.52,12.24,16,10.93,16,9.5C16,5.91,13.09,3,9.5,3S3,5.91,3,9.5C3,13.09,5.91,16,9.5,16 c1.43,0,2.74-0.48,3.81-1.27L19.59,21L21,19.59L14.73,13.31z M9.5,14C7.01,14,5,11.99,5,9.5S7.01,5,9.5,5S14,7.01,14,9.5 S11.99,14,9.5,14z"/><polygon points="10.29,8.44 9.5,6 8.71,8.44 6.25,8.44 8.26,10.03 7.49,12.5 9.5,10.97 11.51,12.5 10.74,10.03 12.75,8.44"/></g></g></svg>';

const loadingSvg: string = '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_Wezc{transform-origin:center;animation:spinner_Oiah .75s step-end infinite}@keyframes spinner_Oiah{8.3%{transform:rotate(30deg)}16.6%{transform:rotate(60deg)}25%{transform:rotate(90deg)}33.3%{transform:rotate(120deg)}41.6%{transform:rotate(150deg)}50%{transform:rotate(180deg)}58.3%{transform:rotate(210deg)}66.6%{transform:rotate(240deg)}75%{transform:rotate(270deg)}83.3%{transform:rotate(300deg)}91.6%{transform:rotate(330deg)}100%{transform:rotate(360deg)}}</style><g class="spinner_Wezc"><circle cx="12" cy="2.5" r="1.5" opacity=".14"/><circle cx="16.75" cy="3.77" r="1.5" opacity=".29"/><circle cx="20.23" cy="7.25" r="1.5" opacity=".43"/><circle cx="21.50" cy="12.00" r="1.5" opacity=".57"/><circle cx="20.23" cy="16.75" r="1.5" opacity=".71"/><circle cx="16.75" cy="20.23" r="1.5" opacity=".86"/><circle cx="12" cy="21.5" r="1.5"/></g></svg>';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends SkeletonAbstractComponent<{ resources: IResource[] }> implements OnInit {
  public readonly title: string = 'angular';

  public resources: IResource[] = [];
  public showSkeleton: boolean = true;

  public skeletonConfig: TSchemaConfig<{ resources: IResource[] }> = {
    repeat: 1,
    schemaGenerator: () => ({
      resources: Array.from({ length: 5 }, () => ({
        title: new SchemaItem<string>().words(3),
        link: new SchemaItem().identical('https://www.google.com'),
        svg: new SchemaItem().identical(loadingSvg),
      })),
    }),
  };

  public constructor(
    public readonly sanitizer: DomSanitizer,
  ) {
    super();
  }

  public ngOnInit(): void {
    setTimeout(() => {
      this.resources = [
        {
          title: 'Learn Angular',
          link: 'https://angular.io/tutorial',
          svg: learnNgSvg,
        },
        {
          title: 'CLI Documentation',
          link: 'https://angular.io/cli',
          svg: cliDocsSvg,
        },
        {
          title: 'Angular Material',
          link: 'https://material.angular.io',
          svg: angularMaterialSvg,
        },
        {
          title: 'Angular Blog',
          link: 'https://blog.angular.io/',
          svg: angularBlogSvg,
        },
        {
          title: 'Angular Devtools',
          link: 'https://angular.io/devtools/',
          svg: angularDevtoolsSvg,
        },
      ];

      this.showSkeleton = false;
    }, Math.max(3_000, Math.random() * 10_000));
  }
}
