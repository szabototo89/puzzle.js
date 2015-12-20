export default class Container {
	constructor() {
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
	
	resolveComponentByParameter(component, parameters) {
		let resolvedComponent = component;
		
		for (const parameter of parameters) {
			resolvedComponent = component.bind(null, parameter);
		}
		
		return resolvedComponent;
	}
	
	resolve(component) {
		const filteredComponents = this.components.filter((item) => item.component === component);
		
		if (filteredComponents.length === 0) {
			throw Error('Trying to resolve a not registered component. Make sure every neccesary component has been registered before calling resolve function.');
		}
		const { component: resolvedComponent, configuration: resolvedConfiguration } = filteredComponents[0];
		
		if (!resolvedConfiguration.parameters) return resolvedComponent;
		
		return this.resolveComponentByParameter(resolvedComponent, resolvedConfiguration.parameters);
	}
}