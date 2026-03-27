import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} from './burgerConstructorSlice';
import { TIngredient } from '../../utils/types';

const bunIngredient: TIngredient = {
  _id: 'bun-id',
  name: 'Булка',
  type: 'bun',
  proteins: 1,
  fat: 1,
  carbohydrates: 1,
  calories: 1,
  price: 10,
  image: 'bun-image',
  image_large: 'bun-image-large',
  image_mobile: 'bun-image-mobile'
};

const mainIngredientOne: TIngredient = {
  _id: 'main-id-1',
  name: 'Начинка 1',
  type: 'main',
  proteins: 2,
  fat: 2,
  carbohydrates: 2,
  calories: 2,
  price: 20,
  image: 'main-image-1',
  image_large: 'main-image-large-1',
  image_mobile: 'main-image-mobile-1'
};

const mainIngredientTwo: TIngredient = {
  _id: 'main-id-2',
  name: 'Начинка 2',
  type: 'main',
  proteins: 3,
  fat: 3,
  carbohydrates: 3,
  calories: 3,
  price: 30,
  image: 'main-image-2',
  image_large: 'main-image-large-2',
  image_mobile: 'main-image-mobile-2'
};

describe('burgerConstructor reducer', () => {
  it('добавляет ингредиент в конструктор', () => {
    const stateWithBun = reducer(undefined, addIngredient(bunIngredient));

    expect(stateWithBun.bun).toMatchObject({
      ...bunIngredient,
      id: expect.any(String)
    });
    expect(stateWithBun.ingredients).toEqual([]);

    const stateWithMain = reducer(
      stateWithBun,
      addIngredient(mainIngredientOne)
    );

    expect(stateWithMain.ingredients).toHaveLength(1);
    expect(stateWithMain.ingredients[0]).toMatchObject({
      ...mainIngredientOne,
      id: expect.any(String)
    });
  });

  it('удаляет ингредиент из начинки', () => {
    const stateWithItem = reducer(undefined, addIngredient(mainIngredientOne));
    const ingredientId = stateWithItem.ingredients[0].id;

    const nextState = reducer(stateWithItem, removeIngredient(ingredientId));

    expect(nextState.ingredients).toEqual([]);
  });

  it('меняет порядок ингредиентов в начинке', () => {
    const stateWithTwoItems = reducer(
      reducer(undefined, addIngredient(mainIngredientOne)),
      addIngredient(mainIngredientTwo)
    );

    const movedUpState = reducer(stateWithTwoItems, moveIngredientUp(1));

    expect(movedUpState.ingredients[0]._id).toBe('main-id-2');
    expect(movedUpState.ingredients[1]._id).toBe('main-id-1');

    const movedDownState = reducer(movedUpState, moveIngredientDown(0));

    expect(movedDownState.ingredients[0]._id).toBe('main-id-1');
    expect(movedDownState.ingredients[1]._id).toBe('main-id-2');
  });
});
