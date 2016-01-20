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
    super(Components.typeName);
    this.children = children;
  }
}


export class Component extends AbstractDefinition {
  constructor({ type, name, lifeTime, children }) {
    super(Component.typeName);

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

export class ConstructorFunction extends AbstractDefinition {
  constructor({ children }) {
    super(ConstructorFunction.typeName);

    if (isDefined(children)) {
      this.children = children;
    }
  }
}

export class Argument extends AbstractDefinition {
  constructor({ position, children, value }) {
    super(Argument.typeName);
    this.position = Number.parseInt(position);
    if (isDefined(children)) {
      this.children = children;
    }
  }
}

export class Constant extends AbstractDefinition {
  constructor({ value, name }) {
    super(Constant.typeName);
    this.value = value;
    
    if (isDefined(name)) {
      this.name = name;
    }
  }
}

export class Reference extends AbstractDefinition {
  constructor({ name, to }) {
    super(Reference.typeName);
    this.to = to;

    if (isDefined(name)) {
      this.name = name;
    }
  }
}

export class Parameter extends AbstractDefinition {
  constructor({ children }) {
    super(Parameter.typeName);
    
    this.children = children;
  }
}

Components.typeName = 'Components';
Component.typeName = 'Component';
ConstructorFunction.typeName = 'ConstructorFunction';
Argument.typeName = 'Argument';
Constant.typeName = 'Constant';
Reference.typeName = 'Reference';
Parameter.typeName = 'Parameter';