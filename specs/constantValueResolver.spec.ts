import { assert } from 'chai';

import ConstantValueResolver from 'resolvers/constantValueResolver';
import AbstractResolver from 'resolvers/abstractResolver'; 
import { Constant } from 'parameterConfigurations';

describe('ConstantValueResolver type', function() {
	it('should implement AbstractResolver type', function() {
		// arrange
		const underTest = new ConstantValueResolver();
	
		// assert
		assert.instanceOf(underTest, AbstractResolver);
	});
	
	describe('canResolve(): Boolean function', function() {
		it('should return true when passing an object value which contains constant key', function() {
			// arrange
			const underTest = new ConstantValueResolver();
			const config = new Constant(1); 
		
			// act
			const result = underTest.canResolve(config);
		
			// assert
			assert.isTrue(result);
		});
		
		it('should return false when passing an object without constant key', function() {
			// arrange
			const underTest = new ConstantValueResolver();
			const config = { param: 1 };
		
			// act
			const result = underTest.canResolve(config);
		
			// assert
			assert.isFalse(result);
		});
	});
	
	describe('resolve(parameterConfiguration, resolver) function', function() {
		it('should return constant value when passing a proper parameterConfiguration value', function() {
			// arrange
			const underTest = new ConstantValueResolver();
			const config = new Constant(32);
		
			// act
			const result = underTest.resolve(config);
		
			// assert
			assert.equal(result, 32);
		});
	});
	
});