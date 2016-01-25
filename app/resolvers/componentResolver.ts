export default class ComponentResolver {

	public args: Array<any>;

	constructor(args: Array<any> = []) {
		this.args = (Array as any).from(args);
	}
}