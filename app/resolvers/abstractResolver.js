export default class AbstractResolver {
	canResolver() {
		return false;
	}
	
	resolve() {
		throw Error('Not implemented yet');
	}
}