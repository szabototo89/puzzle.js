abstract class AbstractResolver {
	public canResolve(parameterConfiguration: any): boolean {
		return false;
	}

	public abstract resolve(parameterConfiguration: any, resolvers: Array<AbstractResolver>);
}

export default AbstractResolver;