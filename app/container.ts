export interface IComponent {
  name: string;
  component: any;
  configuration: any;
}

export interface IContainer {
  resolve(params: { component?: any; name?: string });
  register(params: IComponent): IContainer;
}
