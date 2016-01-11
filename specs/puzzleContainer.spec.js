import PuzzleContainer from 'containers/react/puzzleContainer';
import React from 'react';
import { assert } from 'chai';
import { Component, Argument, Constructor, Constant } from 'containers/react/containerDefinitions';

describe('PuzzleContainer class', function() {
  
  class LabelStub extends React.Component { }
  class TextBoxStub extends React.Component { }
  class HeaderStub extends React.Component { }
  
  describe('getConfiguration() function', function() {
    it('should get configuration through constructor parameters when a complex configuration has been passed', function() {
      // arrange
      const underTest = new PuzzleContainer(
        <Component type={LabelStub} lifeTime="singleton">
          <Constructor>
            <Argument position="0">
              <Component type={TextBoxStub} />
              <Component type={HeaderStub} />
            </Argument>
          </Constructor>
        </Component>  
      );
      // act
      const result = underTest.getConfiguration();
    
      // assert
      assert.isDefined(result);
      assert.deepEqual(result, {
        type: LabelStub,
        lifeTime: "singleton",
        children: [
          { 
            children: [
              { 
                position: 0, 
                children: [
                  { type: TextBoxStub, lifeTime: undefined },
                  { type: HeaderStub, lifeTime: undefined }
                ] 
              }  
            ] 
          }
        ]
      });
    });
    
    it('should get component configuration through constructor parameters when constant value has been passed', function() {
      // arrange
      const underTest = new PuzzleContainer(
        <Component type={LabelStub} lifeTime="singleton">
          <Constructor>
            <Argument position="0">
              <Constant value="Hello World!" />
            </Argument>
          </Constructor>
        </Component>  
      );
      
      // act
      const result = underTest.getConfiguration();
    
      // assert
      assert.isDefined(result);
      assert.deepEqual(result, {
        type: LabelStub,
        lifeTime: "singleton",
        children: [
          { 
            children: [
              { 
                position: 0, 
                children: [
                  { value: "Hello World!" }
                ] 
              }  
            ] 
          }
        ]
      });
    });
  });
  
  describe('resolve() function', function() {
    it('should use StandardContainer class resolve mechanism when passing a configuration through its constructor', function() {
      // arrange
      const LabelStub = (message) => message;
      
      const underTest = new PuzzleContainer(
        <Component type={LabelStub} lifeTime="singleton">
          <Constructor>
            <Argument>
              <Constant value="Hello World" />
            </Argument>
          </Constructor>
        </Component>
      );
      
      // act
      const result = underTest.resolve(LabelStub);
      const value = result();
      
      // assert
      assert.equal(value, "Hello World!");
    });
  })
  
});