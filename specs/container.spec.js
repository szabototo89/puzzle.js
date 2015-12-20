/* global it */
/* global describe */

import Container from 'container'; 
import { assert } from 'chai';

describe('Container class', function() {
	describe('register function', function() {
		it('should register a function without configuration when passing a function', function() {
			// arrange
			const underTest = new Container();
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
			const underTest = new Container();
			const testFunction = (parameter) => parameter;
			const testFunction2 = (parameter) => parameter + 1; 
		
			// act
			underTest.register(testFunction)
						   .register(testFunction2);
			const components = underTest.registeredComponents();
		
			// assert
			assert.equal(components.length, 2);
		});
	});
});