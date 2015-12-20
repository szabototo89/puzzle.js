import AbstractResolver from 'abstractResolver';

export default class ValueResolver extends AbstractResolver {
	canResolve(parameterConfiguration) {
		return parameterConfiguration && parameterConfiguration.value !== undefined;
	}
  
  resolveArray(parameter, resolver) {
    return parameter;
  } 

  resolveObject(parameter, resolver) {
    let result = { } 
    for (const key of Object.keys(parameter)) {
      const value = resolver(parameter[key]);
      result = Object.assign({ }, result, {
        [key]: value
      });
    }    
		return result;
  }
	
	resolve(parameterConfiguration, resolver = (value) => value) {
		const { value: parameter } = parameterConfiguration;
    
    console.log(parameter);
    
    if (Array.isArray(parameter)) {
      return this.resolveArray(parameter, resolver);  
    }
    
    if (parameter instanceof Object) {
      return this.resolveObject(parameter, resolver);
    }
    
    return resolver(parameter);
	}
} 