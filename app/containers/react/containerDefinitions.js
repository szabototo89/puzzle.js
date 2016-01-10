import React from 'react';

export class Component {
  constructor({ type, lifeTime, children }) {
    this.type = type;
    this.lifeTime = lifeTime;
    
    if (children) {
      this.children = children;
    }
  }
}

export class Constructor {
  constructor({ children }) {
    if (children) {
      this.children = children;
    }
  }  
}

export class Argument { 
  constructor({ position, children }) {
    this.position = Number.parseInt(position);
    if (children) {
      this.children = children;
    }
  }
}

export class Constant {
  constructor({ value }) {
    this.value = value;
  }
}