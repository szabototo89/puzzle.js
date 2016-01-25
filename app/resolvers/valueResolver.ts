import AbstractResolver from 'resolvers/abstractResolver';
import { Value } from 'parameterConfigurations';

export default class ValueResolver extends AbstractResolver {
	canResolve(parameterConfiguration: any): boolean {
		return parameterConfiguration &&
           Object.getOwnPropertyNames(parameterConfiguration)
                 .some(propertyName => propertyName === 'value');
	}

  resolveBySpecifiedResolvers(parameter: any, resolvers: Array<AbstractResolver>): any {
    if (resolvers.some(resolver => !(resolver instanceof AbstractResolver))) {
      throw new Error('Resolver must be extended from AbstractResolver');
    }

    for (const resolver of resolvers) {
      if (resolver.canResolve(parameter)) {
        return resolver.resolve(parameter, resolvers);
      }
    }

    return null;
  }

  resolveArray(parameter: Array<any>, resolvers: Array<AbstractResolver>): any {
    return parameter;
  }

  resolveObject(parameter: Object, resolvers: Array<AbstractResolver>): any {
    let result = { };
    for (const key of Object.keys(parameter)) {
      const value = this.resolveBySpecifiedResolvers(parameter[key], resolvers);
      result = (Object as any).assign({ }, result, {
         [key]: value || parameter[key]
      });
    }
		return result;
  }

	resolve(parameterConfiguration: { value: any }, resolvers: Array<AbstractResolver> = [ this ]) {
		const { value: parameter } = parameterConfiguration;
    const value = this.resolveBySpecifiedResolvers(parameter, resolvers);
    if (value) return value;

    if (Array.isArray(parameter)) {
      return this.resolveArray(parameter, resolvers);
    }

    if (parameter.constructor === Value) {
      return this.resolve(parameter, resolvers);
    }

    if (parameter instanceof Object) {
      return this.resolveObject(parameter, resolvers);
    }
    
    return parameter;
	}
}
