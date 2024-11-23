# Skeletonizer
[![codecov](https://codecov.io/github/lukaVarga/skeletonizer/graph/badge.svg?token=4YZYRB9UN7)](https://codecov.io/github/lukaVarga/skeletonizer)

Skeletonizer is a lightweight package that provides a simple way to create skeletonized views for your application. 
It has adapters for Vue and Angular and is highly customizable and easy to use.

With Skeletonizer, you do not need to worry about skeletonized views ever being out of sync with the designs of the components or component parts you wish to skeletonize.
You only need to provide a skeleton config and the package will take care of the rest.

![Vue example](https://github.com/lukaVarga/skeletonizer/blob/main/assets/skeletonizer-example-vue.gif?raw=true)

Example app on Stackblitz for Vue [can be found here](https://stackblitz.com/edit/skeletonizer-vue-example?file=src%2Fviews%2Fdashboard%2FAnalyticsAward.vue)

![Angular example](https://github.com/lukaVarga/skeletonizer/blob/main/assets/skeletonizer-example-angular.gif?raw=true)

Example app on Stackblitz for Angular [can be found here](https://stackblitz.com/edit/vitejs-vite-8vkyr6?file=src%2Fapp%2Fcomponents%2Frevenue-product%2Frevenue-product.component.ts)

## Installation
To install the package, run the following command:
`npm install @skeletonizer/vue @skeletonizer/utils --save` or `npm install @skeletonizer/angular @skeletonizer/utils --save`

## Usage
Refer to the documentation for the specific adapter you are using:
- [Vue](packages/vue/README.md)
- [Angular](packages/angular/README.md)

## Contributing
Run the following commands to get started:
- `npm install`

In the project you wish to work on, run the following command:
- `npm run dev`

Before submitting a pull request, make sure to run the following commands:
- `npm run lint`
- `npm run type-check`
- `npm run coverage`
- `npm run build`

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

