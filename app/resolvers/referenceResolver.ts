import AbstractResolver from 'resolvers/abstractResolver';

export default class ReferenceResolver extends AbstractResolver {

  private container: any;

  constructor(container) {
    super();
    this.container = container;
  }
  
  canResolve(parameterConfiguration: { resolveComponent: any }): boolean {
    return parameterConfiguration.resolveComponent;
  }
  
  resolve(parameterConfiguration: { resolveComponent: any }, resolvers: Array<AbstractResolver>): any {
    const { resolveComponent }  = parameterConfiguration;
    const { container } = this;
    
    if (resolveComponent.constructor === String) {
      return container.resolve({ name: resolveComponent });        
    }
    
    return container.resolve({ component: resolveComponent });
  }
}