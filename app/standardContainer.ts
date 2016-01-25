import { IComponent, IContainer } from 'container';
import ReferenceResolver from 'resolvers/referenceResolver';
import AbstractResolver from 'resolvers/abstractResolver'

export default class StandardContainer implements IContainer {

  private resolvers: Array<AbstractResolver>;
  private components: Array<IComponent>;

	constructor(resolvers: Array<AbstractResolver> = []) {
		this.resolvers = [ new ReferenceResolver(this), ...resolvers ];
		this.components = [];
	}

  register({ name, component, configuration }: IComponent): IContainer {
    this.components.push({
      name, component, configuration
    });

    return this;
  }

	registeredComponents(): Array<IComponent> {
		return [ ...this.components ];
	}

	getParameterValue(parameterConfiguration: any): any {
		for (const resolver of this.resolvers) {
			if (resolver.canResolve(parameterConfiguration)) {
				return resolver.resolve(parameterConfiguration, this.resolvers);
			}
		}

// 		if (parameterConfiguration.resolveComponent) {
//       if (parameterConfiguration.resolveComponent.constructor === String) {
//         return this.resolve({ name: parameterConfiguration.resolveComponent });        
//       }
//       
// 			return this.resolve({ component: parameterConfiguration.resolveComponent });
//     }
// 
// 		return parameterConfiguration;
	}

	resolveComponentByParameter(component: any, parameters: any) {
		return parameters.reduce(
			(resolvedComponent, parameter) => resolvedComponent.bind(null, this.getParameterValue(parameter)),
			component
		);
	}

	resolve({ component, name }: { component: any; name: string }) {
		const [ filteredComponent ] = this.components.filter((item) => {
      if (item.component === undefined) {
        return item.name === name;
      }
      
      if (item.name === undefined) {
        return item.component === component;
      }
      
      return item.component === component && item.name === name;
    });

		if (filteredComponent === undefined) {
			throw Error('Trying to resolve a not registered component. Make sure every necessary component has been registered before calling resolve function.');
		}
    
		const { component: resolvedComponent, configuration: resolvedConfiguration } = filteredComponent;

		if (!resolvedConfiguration.parameters) return resolvedComponent;
		return this.resolveComponentByParameter(resolvedComponent, resolvedConfiguration.parameters);
	}

	resolveAll(): Array<any> {
		return this.components.reduce((components, config) => [ ...components, this.resolve({ component: config.component, name: config.name }) ], []);
	}
}
