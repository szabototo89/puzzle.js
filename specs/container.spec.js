/* global beforeEach */
/* global it */
/* global describe */

import Container from 'container'; 
import { assert } from 'chai';

describe('Container class', function() {
	describe('register(component: Function | Class, configuration: Object) function', function() {
		
		let underTest;
		
		beforeEach(function() {
			underTest = new Container();
		});
		
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
				parameters: [ 1 ]
			});
			const components = underTest.registeredComponents();
		
			// assert
			assert.include(components, {
				component: testFunction, 
				configuration: {
					parameters: [ 1 ]
				}
			});
		});
	});
	
	describe('resolve(component: Object | String) function', function() {
		const testFunction = (parameter) => parameter;
		
		let underTest;
		
		beforeEach(function() {
			underTest = new Container();
		})
		
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
				parameters: [ 1 ]
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
				parameters: [ 1, 2 ]
			});
		
			// act
			const resolvedFunction = underTest.resolve(testFunction);
		
			// assert
			assert.equal(resolvedFunction(), 3);
		});
	});
});