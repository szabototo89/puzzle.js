import PuzzleContainer from 'containers/react/puzzleContainer';
import StandardContainer from 'standardContainer';
import ConstantValueResolver from 'resolvers/constantValueResolver';
import ValueResolver from 'resolvers/valueResolver';
import React from 'react';
import { assert } from 'chai';
import { Components, Component, Argument, ConstructorFunction, Constant, Parameter, Reference } from 'containers/react/containerDefinitions';

describe('PuzzleContainer class', function() {

  class LabelStub extends React.Component { }
  class TextBoxStub extends React.Component { }
  class HeaderStub extends React.Component { }

  describe('getConfiguration() function', function() {
    it('should get configuration through constructor parameters when a complex configuration has been passed', function() {
      // arrange
      const underTest = new PuzzleContainer(
        <Component type={LabelStub} lifeTime="singleton">
          <ConstructorFunction>
            <Argument position="0">
              <Component type={TextBoxStub} />
              <Component type={HeaderStub} />
            </Argument>
          </ConstructorFunction>
        </Component>
      );

      // act
      const result = underTest.getConfiguration();

      // assert
      assert.isDefined(result);
      assert.deepEqual(result, {
        typeOf: 'Component',
        type: LabelStub,
        lifeTime: "singleton",
        children: [
          {
            typeOf: 'ConstructorFunction',
            children: [
              {
                typeOf: 'Argument',
                position: 0,
                children: [
                  { typeOf: 'Component', type: TextBoxStub, lifeTime: undefined },
                  { typeOf: 'Component', type: HeaderStub, lifeTime: undefined }
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
          <ConstructorFunction>
            <Argument position="0">
              <Constant value="Hello World!" />
            </Argument>
          </ConstructorFunction>
        </Component>
      );

      // act
      const result = underTest.getConfiguration();

      // assert
      assert.isDefined(result);
 
      assert.deepEqual(result, {
        typeOf: 'Component',
        type: LabelStub,
        lifeTime: "singleton",
        children: [
          {
            typeOf: 'ConstructorFunction',
            children: [
              {
                typeOf: 'Argument',
                position: 0,
                children: [
                  { typeOf: 'Constant', value: "Hello World!" }
                ]
              }
            ]
          }
        ]
      });
    });

    it('should get component configuration through constructor parameters when constant value has been passed', function() {
      // arrange
      
      /*
        const Label = ({ TextBox, TextBox2 }, value, props) => {
          return <TextBox value= />;
        };
      */

      const underTest = new PuzzleContainer(
        <Components>
          <Component name="TextBoxStub" type={TextBoxStub} />
          <Constant  name="message" value="Hello World!" />
          <Component name="Label" type={LabelStub} lifeTime="singleton">
            <Parameter>
              <Argument position="0">
                <Reference name="TextBox" to="TextBoxStub" />
                <Component name="TextBox2" type={TextBoxStub} />
              </Argument>
              <Argument position="1" />
            </Parameter>
          </Component>
        </Components>
      );

      // act
      const result = underTest.getConfiguration();

      // assert
      assert.isDefined(result);
      const expected = {
        typeOf: 'Components',
        children: [
          { 
            typeOf: 'Component', 
            key: 'TextBoxStub',
            type: TextBoxStub
          },
          { 
            typeOf: 'Constant',
            key: 'message',
            value: 'Hello World!'
          },
          { 
            typeOf: 'Component',
            key: 'Label',
            type: LabelStub,
            lifeTime: 'singleton',
            children: [{
              typeOf: 'Parameter',
              children: [
                { 
                  typeOf: 'Argument',
                  position: 0,
                  children: [
                    { 
                      typeOf: 'Reference',
                      key: 'TextBox',
                      to: 'TextBoxStub' 
                    },
                    { 
                      typeOf: 'Component',
                      key: 'TextBox2',
                      type: TextBoxStub 
                    }
                  ] 
                },
                { 
                  typeOf: 'Argument',
                  position: 1 
                }
              ]
            }] 
          }
        ]
      };
      assert.deepEqual(result, expected);
    });
  });

  describe('resolve() function', function() {
    
    const createContainer = function(configuration) {
      return new PuzzleContainer(configuration, new StandardContainer([ new ConstantValueResolver(), new ValueResolver() ]));
    }
    
    it('should use StandardContainer class resolve mechanism when passing a one-value-based constructor configuration through its constructor', function() {
      // arrange
      const LabelStub = (message) => message;

      const underTest = createContainer(
        <Components>
          <Component type={LabelStub} lifeTime="singleton">
            <ConstructorFunction>
              <Argument>
                <Constant value="Hello World!" />
              </Argument>
            </ConstructorFunction>
          </Component>
        </Components>
      );

      // act
      const result = underTest.resolve(LabelStub);
      const value = result();

      // assert
      assert.equal(value, "Hello World!");
    });
    
     it('should use StandardContainer class resolve mechanism when passing an object-value-based configuration through its constructor', function() {
      // arrange
      const LabelStub = (message) => message;

      const underTest = createContainer(
        <Components>
          <Component type={LabelStub} lifeTime="singleton">
            <ConstructorFunction>
              <Argument>
                <Constant name="one" value="Hello" />
                <Constant name="two" value="World" />
              </Argument>
            </ConstructorFunction>
          </Component>
        </Components>
      );

      // act
      const result = underTest.resolve(LabelStub);
      const value = result();

      // assert
      assert.deepEqual(value, {
        one: "Hello",
        two: "World"
      });
    });
    
    it('should use StandardContainer class resolve multiple arguments without explicit position when passing an object-value-based configuration through its constructor', function() {
      // arrange
      const DummyFunction = (a, b) => [ a, b ];

      const underTest = createContainer(
        <Components>
          <Component type={DummyFunction} lifeTime="singleton">
            <ConstructorFunction>
              <Argument>
                <Constant name="one" value="Hello" />
                <Constant name="two" value="World" />
              </Argument>
              <Argument>
                <Constant value="Hello World!" />
              </Argument>
            </ConstructorFunction>
          </Component>
        </Components>
      );

      // act
      const result = underTest.resolve(DummyFunction);
      const value = result();

      // assert
      assert.deepEqual(value, [{
        one: "Hello",
        two: "World"
      }, "Hello World!"]);
    });
    
    it('should use StandardContainer class resolve multiple arguments with specifying explicit positions when passing an object-value-based configuration through its constructor', function() {
      // arrange
      const DummyFunction = (a, b) => [ a, b ];

      const underTest = createContainer(
        <Components>
          <Component type={DummyFunction} lifeTime="singleton">
            <ConstructorFunction>
              <Argument position="2">
                <Constant name="one" value="Hello" />
                <Constant name="two" value="World" />
              </Argument>
              <Argument position="1">
                <Constant value="Hello World!" />
              </Argument>
            </ConstructorFunction>
          </Component>
        </Components>
      );

      // act
      const result = underTest.resolve(DummyFunction);
      const value = result();

      // assert
      assert.deepEqual(value, ["Hello World!", {
        one: "Hello",
        two: "World"
      }]);
    });
    
    it('should use StandardContainer class resolve another defined component', function() {
      // arrange
      const AnotherDummyFunction = (a) => a; 
      const DummyFunction = (a, b) => [ a(), b ];

      const underTest = createContainer(
        <Components>
          <Component type={AnotherDummyFunction} name="dummy">
            <ConstructorFunction>
              <Argument>
                <Constant value="Hello World!" />
              </Argument>
            </ConstructorFunction>
          </Component>
          <Component type={DummyFunction}>
            <ConstructorFunction>
              <Argument>
                <Reference name="dummy" />
              </Argument>
              <Argument>
                <Constant value={10} />
              </Argument>
            </ConstructorFunction>
          </Component>
        </Components>
      );

      // act
      const result = underTest.resolve(DummyFunction);
      const value = result();

      // assert
      assert.deepEqual(value, [
        "Hello World!", 10
      ])
    });
    
  });
});

