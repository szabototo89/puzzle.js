export default class StandardContainer {
	constructor(resolvers = []) {
		this.resolvers = resolvers;
		this.components = [];
	}

	register(component, configuration = { }) {
		this.components.push({
			component, configuration
		});

		return this;
	}

	registeredComponents() {
		return [ ...this.components ];
	}

	getParameterValue(parameterConfiguration) {
		for (const resolver of this.resolvers) {
			if (resolver.canResolve(parameterConfiguration)) {
				return resolver.resolve(parameterConfiguration, this);
			}
		}

		if (parameterConfiguration.resolveComponent) {
			return this.resolve(parameterConfiguration.resolveComponent);
		}

		return parameterConfiguration;
	}

	resolveComponentByParameter(component, parameters) {
		return parameters.reduce(
			(resolvedComponent, parameter) => resolvedComponent.bind(null, this.getParameterValue(parameter)),
			component
		);
	}

	resolve(component) {
		const filteredComponents = this.components.filter((item) => item.component === component);

		if (filteredComponents.length === 0) {
			throw Error('Trying to resolve a not registered component. Make sure every necessary component has been registered before calling resolve function.');
		}
		const { component: resolvedComponent, configuration: resolvedConfiguration } = filteredComponents[0];

		if (!resolvedConfiguration.parameters) return resolvedComponent;
		return this.resolveComponentByParameter(resolvedComponent, resolvedConfiguration.parameters);
	}

	resolveAll() {
		return this.components.reduce((components, config) => [ ...components, this.resolve(config.component) ], []);
	}
}
