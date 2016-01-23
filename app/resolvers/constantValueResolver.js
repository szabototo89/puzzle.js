import AbstractResolver from 'resolvers/abstractResolver';
import { Constant } from 'parameterConfigurations';

export default class ConstantValueResolver extends AbstractResolver {
	canResolve(parameterConfiguration) {
		return parameterConfiguration && parameterConfiguration instanceof Constant;
	}

	resolve(parameterConfiguration, resolvers) {
		return parameterConfiguration.value;
	}
}
