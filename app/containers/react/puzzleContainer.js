import ReactConfigurationResolver from 'containers/react/reactConfigurationResolver';
import StandardContainer from 'standardContainer';
import { Component } from 'containers/react/containerDefinitions';
import { Constant } from 'parameterConfigurations';
import ConstantValueResolver from 'resolvers/constantValueResolver';

class PuzzleContainer {
  constructor(configuration, container = new StandardContainer([ new ConstantValueResolver() ]), configurationResolver = new ReactConfigurationResolver()) {
    this.configuration = configurationResolver.resolve(configuration);
    this.container = container;
    
    this.createObjectGraph(container, this.getConfiguration());
  }
  
  createObjectGraph(container, configuration) {
    // function registerComponentByConstructor(component) {
    //   
    // }
    // 
    // function createObjectGraphByComponent(child) {
    //   const { type } = child;
    //   if (!type) throw new Error('Type must be defined in the current component.', child);
    //   
    //   this.container.register(type);
    // }
    
    function getArgumentConstantValue(config) {
      if (config.typeOf !== 'Constant') {
        return null;
      }
      
      const { name, value } = config;
      return {
        name,
        value: new Constant(value)
      };
    }
    
    function getArgument(argument, index) {
      if (argument.typeOf !== 'Argument') {
        throw new Error(`Unsupported argument: ${argument.typeOf}`);
      }
      
      const { children } = argument;
      const position = argument.position || index;
      const argumentValues = children.map(child => getArgumentConstantValue(child));
      
      if (argumentValues.length === 0) {
        throw new Error('Argument doesn\'t have any value.');  
      }
      
      if (argumentValues.length === 1) {
        return {
          position: 0,
          value: argumentValues.shift().value
        };
      }
      
      return {
        position,
        value: argumentValues.reduce((previousValue, { name, value }) => Object.assign({}, previousValue, {
          [name]: value
        }))
      };
    }
    
    function getConstructor(config) {
      if (config.typeOf !== 'Constructor') {
        throw new Error(`Unsupported constructor: ${config.typeOf}`);
      }
      
      const { children } = config;
      const args = children.filter(child => child.typeOf === 'Argument')
                           .map(getArgument)
                           .sort(({ position: pos1 }, { position: pos2 }) => pos1 - pos2)
                           .map(({ value }) => value);
                           
      return args;                           
    }
    
    function createComponent(config) {
      if (config.typeOf !== 'Component') {
        throw new Error(`Unsupported component: ${config.typeOf}.`);
      }
      
      const { name, type, children } = config;
      const [ constructorArgs ] = children.filter(child => child.typeOf === 'Constructor') 
                                      .map(getConstructor);
                                   
      container.register(type, {
        parameters: constructorArgs
      });
    }
    
    function createComponents(config) {
       const { children } = config;
       const components = children.filter((child) => child.typeOf === 'Component')
                                  .map(createComponent);                                  
    }
    
    if (configuration.typeOf === 'Components') {
      createComponents(configuration);
    }
  }
  
  getConfiguration() {
    return Object.assign({ }, this.configuration);
  }
  
  resolve(component) {
    return this.container.resolve(component);
  }
}

export default PuzzleContainer;