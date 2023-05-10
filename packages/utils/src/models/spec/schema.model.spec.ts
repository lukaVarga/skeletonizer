import { describe, it, expect, beforeEach } from 'vitest';
import { SchemaItem } from '../schema-item.model';
import { TTestComplexSkeletonConfig } from '../../../spec-helpers/test.helper.types';
import { TSchemaGenerator } from '../../types';
import { Schema } from '../schema.model';

describe('Schema', () => {
  const generator: TSchemaGenerator<TTestComplexSkeletonConfig> = () => ({
    stringArray: [new SchemaItem().identical('string1'), new SchemaItem().identical('string2')],
    someBool: new SchemaItem().identical(true),
    complexObj: {
      foo: new SchemaItem().identical('bar'),
      test: new SchemaItem().identical(1),
      innerObj: {
        numArr: [new SchemaItem().identical(1), new SchemaItem().identical(2)],
        date: new SchemaItem().identical(new Date('2023-02-10')),
        symbol: new SchemaItem().symbol('test'),
      },
    },
  });

  let schema: Schema<TTestComplexSkeletonConfig>;

  beforeEach(() => {
    schema = new Schema<TTestComplexSkeletonConfig>(generator);
  });

  it('creates an instance of the Schema class', () => {
    expect(schema).toBeInstanceOf(Schema);
  });

  it('has the correct value', () => {
    const expectedValue: TTestComplexSkeletonConfig = {
      stringArray: ['string1', 'string2'],
      someBool: true,
      complexObj: {
        foo: 'bar',
        test: 1,
        innerObj: {
          numArr: [1, 2],
          date: new Date('2023-02-10'),
          symbol: expect.any(Symbol),
        },
      },
    };

    expect(schema.value).toEqual(expectedValue);
    expect(schema.value.complexObj.innerObj.symbol.toString()).toEqual('Symbol(test)');
  });

  it('has the correct viewModel', () => {
    expect(schema.viewModel).toEqual(generator());
  });
});

