import * as React from 'react';

export function isDefined<T>(value: T) {
  return value !== undefined && value !== null;
}

class AbstractElementClass extends React.Component<any, any> { }

class AbstractDefinition extends AbstractElementClass {
  protected typeOf: string;

  constructor(type: string) {
    super();
    this.typeOf = type;
  }
}

export class Components extends AbstractDefinition {
  public static typeName: string;
  public children: Array<AbstractDefinition>

  constructor({ children }: { children: Array<AbstractDefinition> }) {
    super(Components.typeName);
    this.children = children;
  }
}

export class Component extends AbstractDefinition {
  public static typeName: string;

  public type: any;
  public lifeTime: string;
  public name: string;
  public children: Array<AbstractDefinition>

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
  public static typeName: string;
  public children: Array<AbstractDefinition>;

  constructor({ children }) {
    super(ConstructorFunction.typeName);

    if (isDefined(children)) {
      this.children = children;
    }
  }
}

export class Argument extends AbstractDefinition {

  public static typeName: string;
  public position: number;
  public children: Array<AbstractDefinition>;

  constructor({ position, children, value }) {
    super(Argument.typeName);
    this.position = (Number as any).parseInt(position);
    if (isDefined(children)) {
      this.children = children;
    }
  }
}

export class Constant extends AbstractDefinition {

  public static typeName: string;
  public value: string;
  public name: string;

  constructor({ value, name }) {
    super(Constant.typeName);
    this.value = value;
    
    if (isDefined(name)) {
      this.name = name;
    }
  }
}

export class Reference extends AbstractDefinition {
  public static typeName: string;
  public to: any;
  public name: string;

  constructor({ name, to }) {
    super(Reference.typeName);
    this.to = to;

    if (isDefined(name)) {
      this.name = name;
    }
  }
}

export class Parameter extends AbstractDefinition {
  public static typeName: string;
  public children: Array<AbstractDefinition>;

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