/* global describe */
import ValueResolver from 'resolvers/valueResolver';
import { Value } from 'parameterConfigurations';
import { assert } from 'chai';

describe('ValueResolver type', function() {
	
	let underTest;
	
	beforeEach(function() {
		underTest = new ValueResolver();
	});
	
	describe('canResolve() function', function() {
		it('should return true when passed configuration contains value key', function() {
			// arrange
			const parameterConfiguration = new Value({ 'hello': 'world'	});
		
			// act
			const result = underTest.canResolve(parameterConfiguration);
		
			// assert
			assert.isTrue(result);
		});
    
    it('should return true when passed configuration contains an array', function() {
			// arrange
			const parameterConfiguration = new Value([1, 2, 3]);
		
			// act
			const result = underTest.canResolve(parameterConfiguration);
		
			// assert
			assert.isTrue(result);
		});
	});
	
	describe('resolve() function', function() {
		it('should resolve object literal as a constant when passing a classic object literal', function() {
			// arrange
			const parameterConfiguration = new Value({ 'hello': 'world' });
		
			// act
			const result = underTest.resolve(parameterConfiguration);
		
			// assert
			assert.deepEqual(result, { 'hello': 'world' });
		});
		
		it('should resolve array literal as a constant when passing a classic array value', function() {
			// arrange
      const parameterConfiguration = new Value([1, 2, 3]);
		
			// act
			const result = underTest.resolve(parameterConfiguration);
		
			// assert
			assert.deepEqual(result, [1, 2, 3]);
		});
    
    it('should resolve object literal as an inner constant value when passing an object literal', function() {
			// arrange
			const parameterConfiguration = new Value({ 'hello': new Value('world') });
		
			// act
			const result = underTest.resolve(parameterConfiguration);
		
			// assert
			assert.deepEqual(result, { 'hello': 'world' });
		});
    
    it('should resolve object literal as an deep inner constant value when passing an object literal', function() {
			// arrange
			const parameterConfiguration = new Value({ 'hello': new Value({ 'beautiful': new Value('world') }) });
		
			// act
			const result = underTest.resolve(parameterConfiguration);
		
			// assert
			assert.deepEqual(result, { 'hello': { 'beautiful': 'world' } });
		});
	});
});