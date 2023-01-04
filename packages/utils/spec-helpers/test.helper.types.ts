export type TTestComplexSkeletonConfig = {
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
};
