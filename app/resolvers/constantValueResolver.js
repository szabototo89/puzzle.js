import AbstractResolver from 'resolvers/abstractResolver';

export default class ConstantValueResolver extends AbstractResolver {
	canResolve(parameterConfiguration) {
		return parameterConfiguration && parameterConfiguration.constant !== undefined;
	}
	
	resolve(parameterConfiguration, resolver) {
		return parameterConfiguration.constant;	
	}
}