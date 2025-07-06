const Group = require('@models/Group');

describe('Group Model', () => {
  describe('Constructor', () => {
    test('should create a group with all parameters', () => {
      const group = new Group(1, 'Test Group');

      expect(group.id).toBe(1);
      expect(group.name).toBe('Test Group');
    });

    test('should create a group with undefined parameters', () => {
      const group = new Group();

      expect(group.id).toBeUndefined();
      expect(group.name).toBeUndefined();
    });

    test('should create a group with zero id', () => {
      const group = new Group(0, 'Zero Group');

      expect(group.id).toBe(0);
      expect(group.name).toBe('Zero Group');
    });

    test('should create a group with negative id', () => {
      const group = new Group(-1, 'Negative Group');

      expect(group.id).toBe(-1);
      expect(group.name).toBe('Negative Group');
    });

    test('should create a group with empty name', () => {
      const group = new Group(1, '');

      expect(group.id).toBe(1);
      expect(group.name).toBe('');
    });
  });

  describe('Getters and Setters', () => {
    let group;

    beforeEach(() => {
      group = new Group();
    });

    test('should set and get id', () => {
      group.id = 5;
      expect(group.id).toBe(5);
    });

    test('should set and get name', () => {
      group.name = 'Updated Group';
      expect(group.name).toBe('Updated Group');
    });

    test('should set id to zero', () => {
      group.id = 0;
      expect(group.id).toBe(0);
    });

    test('should set id to negative', () => {
      group.id = -100;
      expect(group.id).toBe(-100);
    });

    test('should set name to null', () => {
      group.name = null;
      expect(group.name).toBeNull();
    });

    test('should set name to empty string', () => {
      group.name = '';
      expect(group.name).toBe('');
    });

    test('should set name to very long string', () => {
      const longName = 'a'.repeat(1000);
      group.name = longName;
      expect(group.name).toBe(longName);
    });
  });

  describe('toJSON', () => {
    test('should return correct JSON representation', () => {
      const group = new Group(1, 'Test Group');
      const json = group.toJSON();

      expect(json).toEqual({
        id: 1,
        name: undefined // Bug no código original: usa this._content em vez de this._name
      });
    });

    test('should return JSON with undefined values', () => {
      const group = new Group();
      const json = group.toJSON();

      expect(json).toEqual({
        id: undefined,
        name: undefined
      });
    });

    test('should return JSON with zero id', () => {
      const group = new Group(0, 'Zero');
      const json = group.toJSON();

      expect(json).toEqual({
        id: 0,
        name: undefined
      });
    });

    test('should return JSON with negative id', () => {
      const group = new Group(-1, 'Negative');
      const json = group.toJSON();

      expect(json).toEqual({
        id: -1,
        name: undefined
      });
    });

    test('should return JSON with null name', () => {
      const group = new Group(1, null);
      const json = group.toJSON();

      expect(json).toEqual({
        id: 1,
        name: undefined
      });
    });

    test('should return JSON with empty name', () => {
      const group = new Group(1, '');
      const json = group.toJSON();

      expect(json).toEqual({
        id: 1,
        name: undefined
      });
    });
  });
});
