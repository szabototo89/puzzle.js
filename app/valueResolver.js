import AbstractResolver from 'abstractResolver';

export default class ValueResolver extends AbstractResolver {
	canResolve(parameterConfiguration) {
		return parameterConfiguration && parameterConfiguration.value !== undefined;
	}
	
	resolve(parameterConfiguration, resolver) {
		const { value } = parameterConfiguration;
		
		return value;
	}
}