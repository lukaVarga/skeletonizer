export type TTestComplexSkeletonConfig = {
  stringArray: string[];
  someBool: boolean;
  complexObj: {
    foo: 'bar';
    test: number;
    innerObj: {
      numArr: number[];
      date: Date;
      symbol: symbol;
    };
  };
};
