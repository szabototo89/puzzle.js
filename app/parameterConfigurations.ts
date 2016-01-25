class ParameterConfiguration<TValue> {
  public value: TValue;

  constructor(value: TValue) {
    this.value = value;
  }
}

export class Value<TValue> extends ParameterConfiguration<TValue> {
  constructor(value: TValue) {
    super(value);
  }
}

export class Constant<TValue> extends ParameterConfiguration<TValue> {
  constructor(value: TValue) {
    super(value);
  }
}