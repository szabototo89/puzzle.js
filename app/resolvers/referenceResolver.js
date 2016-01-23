import AbstractResolver from 'resolvers/abstractResolver';

export default class ReferenceResolver extends AbstractResolver {
  
  constructor(container) {
    super();
    this.container = container;
  }
  
  canResolve(parameterConfiguration, resolvers) {
    return parameterConfiguration.resolveComponent;
  }
  
  resolve(parameterConfiguration, resolvers) {
    const { resolveComponent }  = parameterConfiguration;
    const { container } = this;
    
    if (resolveComponent.constructor === String) {
      return container.resolve({ name: resolveComponent });        
    }
    
    return container.resolve({ component: resolveComponent });
  }
}