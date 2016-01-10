class ReactConfigurationResolver {
  
  resolveChildren(children) {
    if (!children) return null;
    if (Array.isArray(children)) {
      return children.map(child => this.resolve(child));
    }
    
    return [ this.resolve(children) ];
  }
  
  resolve(definition) {
    const { type, props } = definition;
    const args = Object.assign({ }, props, {
      children: this.resolveChildren(props.children)
    });
    
    return new type(args);  
  }
}

export default ReactConfigurationResolver;