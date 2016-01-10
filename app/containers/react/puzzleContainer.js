import ReactConfigurationResolver from 'containers/react/reactConfigurationResolver';

class PuzzleContainer {
  constructor(configuration, resolver = new ReactConfigurationResolver()) {
    this.configuration = resolver.resolve(configuration);
  }
  
  getConfiguration() {
    return Object.assign({ }, this.configuration);
  }
}

export default PuzzleContainer;