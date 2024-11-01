export interface ITestComplexSkeletonConfig {
  stringArray: string[];
  someBool: boolean;
  complexObj: {
    foo: string;
    test: number;
    innerObj: {
      numArr: number[];
      date: Date;
      symbol: symbol;
    };
  };
}
