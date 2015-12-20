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
}