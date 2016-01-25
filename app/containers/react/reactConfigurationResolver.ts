class ReactConfigurationResolver {
  
  resolveChildren(children) {
    if (!children) return null;
    if (Array.isArray(children)) {
      return children.map(child => this.resolve(child));
    }
    
    return [ this.resolve(children) ];
  }
  
  resolve(definition) {
    const { type: Type, props } = definition;
    const args = (Object as any).assign({ }, props, {
      children: this.resolveChildren(props.children)
    });
    
    return new Type(args);  
  }
}

export default ReactConfigurationResolver;