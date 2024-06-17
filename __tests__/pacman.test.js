import MovingDirection from '../src/MovingDirection';

describe('MovingDirection', () => {
  it('should have the correct properties', () => { // проверяет, что MovingDirection содержит свойства up, down, left и right. 
    expect(MovingDirection).toHaveProperty('up');
    expect(MovingDirection).toHaveProperty('down');
    expect(MovingDirection).toHaveProperty('left');
    expect(MovingDirection).toHaveProperty('right');
  });

  it('should have correct numeric values', () => { // проверяет что каждое из свойств MovingDirection имеет правильное числовое значение, как определено в коде
    expect(MovingDirection.up).toEqual(0);
    expect(MovingDirection.down).toEqual(1);
    expect(MovingDirection.left).toEqual(2);
    expect(MovingDirection.right).toEqual(3);
  });
  it('should have properties defined', () => { // проверяет, что MovingDirectionа, up, down, left, right  определены (toBeDefined()) 
    expect(MovingDirection).toBeDefined();
    expect(MovingDirection.up).toBeDefined();
    expect(MovingDirection.down).toBeDefined();
    expect(MovingDirection.left).toBeDefined();
    expect(MovingDirection.right).toBeDefined();
  });

});
