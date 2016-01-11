import ReactConfigurationResolver from 'containers/react/reactConfigurationResolver';
import StandardContainer from 'standardContainer';
import { Component } from 'containers/react/containerDefinitions';

class PuzzleContainer {
  constructor(configuration, container = new StandardContainer(), configurationResolver = new ReactConfigurationResolver()) {
    this.configuration = configurationResolver.resolve(configuration);
    this.container = container;
    
    this.buildObjectGraph(container);
  }
  
  buildObjectGraph(container) {
    const configuration = this.getConfiguration();
    
    const { type } = configuration;
    container.register(type, {
      parameters: [  ]
    });
  }
  
  getConfiguration() {
    return Object.assign({ }, this.configuration);
  }
  
  resolve(component) {
    return this.container.resolve(component);
  }
}

export default PuzzleContainer;