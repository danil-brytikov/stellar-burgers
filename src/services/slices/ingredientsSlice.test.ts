import reducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

const ingredientsMock: TIngredient[] = [
  {
    _id: '1',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: 'image',
    image_large: 'image_large',
    image_mobile: 'image_mobile'
  }
];

describe('ingredients reducer', () => {
  it('обрабатывает pending экшен', () => {
    const state = reducer(undefined, fetchIngredients.pending('request-id'));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обрабатывает fulfilled экшен', () => {
    const state = reducer(
      undefined,
      fetchIngredients.fulfilled(ingredientsMock, 'request-id')
    );

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(ingredientsMock);
  });

  it('обрабатывает rejected экшен', () => {
    const error = new Error('Ошибка загрузки ингредиентов');

    const state = reducer(
      undefined,
      fetchIngredients.rejected(error, 'request-id')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ингредиентов');
  });
});
