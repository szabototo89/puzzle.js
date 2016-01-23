import ReferenceResolver from 'resolvers/referenceResolver';

export default class StandardContainer {
	constructor(resolvers = []) {
		this.resolvers = [ new ReferenceResolver(this), ...resolvers ];
		this.components = [];
	}

  register({ name, component, configuration }) {
    this.components.push({
      name, component, configuration
    });
    return this;
  }

	registeredComponents() {
		return [ ...this.components ];
	}

	getParameterValue(parameterConfiguration) {
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

	resolveComponentByParameter(component, parameters) {
		return parameters.reduce(
			(resolvedComponent, parameter) => resolvedComponent.bind(null, this.getParameterValue(parameter)),
			component
		);
	}

	resolve({ component, name }) {
		const [ filteredComponent ] = this.components.filter((item) => {
      if (item.component === void 0) {
        return item.name === name;
      }
      
      if (item.name === void 0) {
        return item.component === component;
      }
      
      return item.component === component && item.name === name;
    });

		if (filteredComponent === void 0) {
			throw Error('Trying to resolve a not registered component. Make sure every necessary component has been registered before calling resolve function.');
		}
    
		const { component: resolvedComponent, configuration: resolvedConfiguration } = filteredComponent;

		if (!resolvedConfiguration.parameters) return resolvedComponent;
		return this.resolveComponentByParameter(resolvedComponent, resolvedConfiguration.parameters);
	}

	resolveAll() {
		return this.components.reduce((components, config) => [ ...components, this.resolve({ component: config.component, name: config.name }) ], []);
	}
}
