import React from 'react';

const isDefined = ((undefined) => {
  return function isDefined(value) {
    return value !== undefined && value !== null;
  };
})();

class AbstractDefinition {
  constructor(type) {
    this.typeOf = type;
  }
}

export class Components extends AbstractDefinition {
  constructor({ children }) {
    super('Components');
    this.children = children;
  }
}

export class Component extends AbstractDefinition {
  constructor({ type, name, lifeTime, children }) {
    super('Component');

    this.type = type;
    this.lifeTime = lifeTime;

    if (isDefined(name)) {
      this.name = name;
    }

    if (isDefined(children)) {
      this.children = children;
    }
  }
}

export class Constructor extends AbstractDefinition {
  constructor({ children }) {
    super('Constructor');

    if (isDefined(children)) {
      this.children = children;
    }
  }
}

export class Argument extends AbstractDefinition {
  constructor({ position, children, value }) {
    super('Argument');
    this.position = Number.parseInt(position);
    if (isDefined(children)) {
      this.children = children;
    }
  }
}

export class Constant extends AbstractDefinition {
  constructor({ value, name }) {
    super('Constant');
    this.value = value;
    
    if (isDefined(name)) {
      this.name = name;
    }
  }
}

export class Reference extends AbstractDefinition {
  constructor({ name, to }) {
    super('Reference');
    this.to = to;

    if (isDefined(name)) {
      this.name = name;
    }
  }
}

export class Parameter extends AbstractDefinition {
  constructor({ children }) {
    super('Parameter');
    
    this.children = children;
  }
}