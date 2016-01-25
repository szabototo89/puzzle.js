/* global beforeEach */
/* global it */
/* global describe */

import AbstractResolver from 'resolvers/abstractResolver';
import ConstantValueResolver from 'resolvers/constantValueResolver';
import { Constant, Value } from 'parameterConfigurations';
import StandardContainer from 'standardContainer';
import { assert } from 'chai';
import React from 'react/addons';
import jsdom from 'mocha-jsdom';

describe('StandardContainer type', function() {

  class StandardContainerBuilder {

		private components: Array<any>;
		private valueResolvers: Array<AbstractResolver>;

    constructor() {
      this.components = [];
    }

    getLastComponent() {
      return this.components[this.components.length - 1];
    }

    withValueResolvers(...valueResolvers: Array<AbstractResolver>): StandardContainerBuilder {
      const lastComponent = this.getLastComponent();
      lastComponent.valueResolvers = valueResolvers;
      return this;
    }

    withComponent(component): StandardContainerBuilder {
      this.components.push({
        component: component
      });

      return this;
    }

    withComponentName(componentName: string): StandardContainerBuilder {
      const lastComponent = this.getLastComponent();
      lastComponent.componentName = componentName;
      return this;
    }

    withParameters(...parameters): StandardContainerBuilder {
      const lastComponent = this.getLastComponent();
      lastComponent.parameters = parameters;
      return this;
    }

    build(): StandardContainer {
      const defaultValueResolver = new ConstantValueResolver();
      const container = new StandardContainer(this.valueResolvers || [ defaultValueResolver ]);

      for (const component of this.components) {
        container.register({
          name: component.componentName,
          component: component.component,
          configuration: {
            parameters: component.parameters
          }
        });
      }

      return container;
    }
  }

	const constant = function(value) {
		return new Constant(value);
	};

	const resolve = function(value) {
		return { resolveComponent: value };
	};

	let underTest;
  let builder;

	beforeEach(function() {
		const constantValueResolver = new ConstantValueResolver();
		underTest = new StandardContainer([ constantValueResolver ]);
    builder = new StandardContainerBuilder();
	});

	describe('register(component: Function | Class, configuration: Object) function', function() {
		it('should register a function without configuration when passing a function', function() {
			// arrange
			const testFunction = (parameter) => parameter;
      const underTest = builder.withComponent(testFunction)
                               .build();

			// act
			const components = underTest.registeredComponents();

			// assert

      console.info(components);

			assert.include(components, {
        name: undefined,
				component: testFunction,
				configuration: {
          parameters: undefined
        }
			});
		});

		it('should register multiple functions when chaining it', function() {
			// arrange
			const testFunction = (parameter) => parameter;
			const testFunction2 = (parameter) => parameter + 1;
      const underTest = builder.withComponent(testFunction)
                               .withComponent(testFunction2)
                               .build();

			// act
			const components = underTest.registeredComponents();

			// assert
			assert.equal(components.length, 2);
		});

		it('should register a function with constant positioned parameter when passing it with a configuration', function() {
			// arrange
			const testFunction = parameter => parameter;
      const underTest = builder.withComponent(testFunction)
                               .withParameters(constant(1))
                               .build();

			// act
			const components = underTest.registeredComponents();

			// assert
			assert.include(components, {
        name: undefined,
				component: testFunction,
				configuration: {
					parameters: [ constant(1) ]
				}
			});
		});
	});

	describe('resolve({ component: Object, name: String }) function', function() {
		const testFunction = (parameter) => parameter;

		jsdom();	// initialize jsdom

		it('should resolve an object by reference when registering it with default configuration', function() {
			// arrange
      const underTest = builder.withComponent(testFunction).build();

			// act
			const result = underTest.resolve({
        component: testFunction
      });

			// assert
			assert.strictEqual(result, testFunction);
		});

		it('should throw a not registered error when trying to resolve a not registered component', function() {
			// arrange

			// act
			const callResolveFunction = () => underTest.resolve({
        component: testFunction
      });

			// assert
			assert.throws(callResolveFunction, Error, 'Trying to resolve a not registered component. Make sure every necessary component has been registered before calling resolve function.')
		});

		it('should resolve a function with positioned parameter when registering it with positioned parameter', function() {
			// arrange
      const underTest = builder.withComponent(testFunction)
                               .withParameters(constant(1))
                               .build();

			// act
			const resolvedFunction = underTest.resolve({
        component: testFunction
      });

			// assert
			assert.equal(resolvedFunction(), 1);
		});

		it('should resolve a function with multiple positioned parameters when registering it with two positioned parameters', function() {
			// arrange
			const testFunction = (a, b) => a + b;

      const underTest = builder.withComponent(testFunction)
                               .withParameters(constant(1), constant(2))
                               .build();

			// act
			const resolvedFunction = underTest.resolve({
        component: testFunction
      });

			// assert
			assert.equal(resolvedFunction(), 3);
		});

		it('should resolve a function with another registered function when the first parameter refers to another registered component', function() {
			// arrange
			const id = value => value;
			const testFunction = (func, b) => func() + b;
      const underTest = builder.withComponent(id).withParameters(constant(2))
                               .withComponent(testFunction).withParameters(resolve(id), constant(1))
                               .build();

			// act
			const resolvedFunction = underTest.resolve({
        component: testFunction
      });

			// assert
			assert.equal(resolvedFunction(), 3);
		});

		it('should resolve a stateless React component when passing a number to construct it', function() {
			// arrange'
			const TestUtils = React.addons.TestUtils;
			const DummyComponent: any = (props) => {
				return (<span>{props.number}</span>);
			};
			const TestComponent = (number, props) => {
				return <DummyComponent number={number} {...props} />;
			};
			const renderer = TestUtils.createRenderer();

      const underTest = builder.withComponent(TestComponent)
                               .withParameters(constant(3))
                               .build();

			// act
			const ResolvedComponent = underTest.resolve({
        component: TestComponent
      });
			renderer.render(<ResolvedComponent />);
			const component = renderer.getRenderOutput();

			// assert
			assert.deepEqual(component, <DummyComponent number={3} />);
		});
	});

	describe('resolveAll() function', function() {
		it('should resolve all registered components', function() {
			// arrange
			const id = (parameter) => parameter;
			const sum = (a, b) => a + b;
			const sumFunction = (func, b) => func() + b;

      const underTest = builder.withComponent(id).withParameters(constant(2))
                               .withComponent(sum).withParameters(constant(1), constant(2))
                               .withComponent(sumFunction).withParameters(resolve(sum), constant(3))
                               .build();

			// act
			const resolvedComponents = underTest.resolveAll();

			// assert
			assert.equal(resolvedComponents.length, 3);
			assert.equal(resolvedComponents[0](), 2, 'id() should return 2');
			assert.equal(resolvedComponents[1](), 3, 'sum() should return 3');
			assert.equal(resolvedComponents[2](), 6, 'sumFunction() should return 6');
		});
	});
});