import ComponentResolver from 'resolvers/componentResolver';
import { assert } from 'chai';

describe('ComponentResolver class', function() {
	it('should be instantiated by new() operator', function() {
		// arrange
		const underTest = new ComponentResolver();
		
		// act
	
		// assert
		assert.isDefined(underTest);
	});
});