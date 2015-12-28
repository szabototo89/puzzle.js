class ParameterConfiguration {
  constructor(value) {
    this.value = value;
  }
}

export class Value extends ParameterConfiguration {
  constructor(value) {
    super(value);
  }
}

export class Constant extends ParameterConfiguration {
  constructor(value) {
    super(value);
  }
}