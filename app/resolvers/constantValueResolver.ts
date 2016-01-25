import AbstractResolver from 'resolvers/abstractResolver';
import { Constant } from 'parameterConfigurations';

export default class ConstantValueResolver extends AbstractResolver {
	public canResolve(parameterConfiguration: any): boolean {
		return parameterConfiguration && parameterConfiguration instanceof Constant;
	}

	public resolve(parameterConfiguration: Constant<any>, resolvers?: Array<AbstractResolver>) {
		return parameterConfiguration.value;
	}
}
