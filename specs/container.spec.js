/* global beforeEach */
/* global it */
/* global describe */

import ConstantValueResolver from 'resolvers/constantValueResolver';
import Container from 'container'; 
import { assert } from 'chai';
import React from 'react/addons';
import jsdom from 'mocha-jsdom';

describe('Container type', function() {
	
	const constant = function(value) {
		return {
			constant: value
		};
	};
	
	const resolve = function(value) {
		return { resolveComponent: value };
	};
	
	let underTest;
	
	beforeEach(function() {
		const constantValueResolver = new ConstantValueResolver(); 
		underTest = new Container([ constantValueResolver ]);
	});
	
	describe('register(component: Function | Class, configuration: Object) function', function() {
		it('should register a function without configuration when passing a function', function() {
			// arrange
			const testFunction = (parameter) => parameter; 
		
			// act
			underTest.register(testFunction);
			const components = underTest.registeredComponents();
		
			// assert
			assert.include(components, {
				component: testFunction,
				configuration: { }
			});
		});
		
		it('should register multiple functions when chaining it', function() {
			// arrange
			const testFunction = (parameter) => parameter;
			const testFunction2 = (parameter) => parameter + 1; 
		
			// act
			underTest.register(testFunction)
						   .register(testFunction2);
			const components = underTest.registeredComponents();
		
			// assert
			assert.equal(components.length, 2);
		});
		
		it('should register a function with constant positioned parameter when passing it with a configuration', function() {
			// arrange
			const testFunction = parameter => parameter;
		
			// act
			underTest.register(testFunction, {
				parameters: [ constant(1) ]
			});
			const components = underTest.registeredComponents();
		
			// assert
			assert.include(components, {
				component: testFunction, 
				configuration: {
					parameters: [ constant(1) ]
				}
			});
		});
	});
	
	describe('resolve(component: Object | String) function', function() {
		const testFunction = (parameter) => parameter;
		
		jsdom();	// initialize jsdom
		
		it('should resolve an object by reference when registering it with default configuration', function() {
			// arrange
			underTest.register(testFunction);
		
			// act
			const result = underTest.resolve(testFunction);
		
			// assert
			assert.strictEqual(result, testFunction);
		});
		
		it('should throw a not registered error when trying to resolve a not registered component', function() {
			// arrange
		
			// act
			const callResolveFunction = () => underTest.resolve(testFunction);
		
			// assert
			assert.throws(callResolveFunction, Error, 'Trying to resolve a not registered component. Make sure every neccesary component has been registered before calling resolve function.')
		});
		
		it('should resolve a function with positioned parameter when registering it with positioned parameter', function() {
			// arrange
			underTest.register(testFunction, {
				parameters: [ constant(1) ]
			});
		
			// act
			const resolvedFunction = underTest.resolve(testFunction);
		
			// assert
			assert.equal(resolvedFunction(), 1);
		});
		
		it('should resolve a function with multiple positioned parameters when registering it with two positioned parameters', function() {
			// arrange
			const testFunction = (a, b) => a + b;
			
			underTest.register(testFunction, {
				parameters: [ constant(1), constant(2) ]
			});
		
			// act
			const resolvedFunction = underTest.resolve(testFunction);
		
			// assert
			assert.equal(resolvedFunction(), 3);
		});
		
		it('should resolve a function with another registered function when the first parameter refers to another registered component', function() {
			// arrange
			const id = value => value;
			const testFunction = (func, b) => func() + b;
			
			underTest.register(id, { 
					parameters: [ constant(2) ]
				})
				.register(testFunction, {
					parameters: [ resolve(id), constant(1) ]
				});
		
			// act
			const resolvedFunction = underTest.resolve(testFunction);
		
			// assert
			assert.equal(resolvedFunction(), 3);
		});
		
		it('should resolve a stateless React component when passing a number to construct it', function() {
			// arrange'
			const TestUtils = React.addons.TestUtils;
			const DummyComponent = (props) => {
				return <span>{props.number}</span>;
			};
			const TestComponent = (number, props) => {
				return <DummyComponent number={number} {...props} />;
			};
			const renderer = TestUtils.createRenderer();
			
			underTest.register(TestComponent, {
				parameters: [ constant(3) ]
			});
		
			// act
			const ResolvedComponent = underTest.resolve(TestComponent);
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
			
			underTest
				.register(id, {
					parameters: [ constant(2) ],
				})
				.register(sum, {
					parameters: [ constant(1), constant(2) ]
				})
				.register(sumFunction, {
					parameters: [ resolve(sum), 3 ]
				});
		
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