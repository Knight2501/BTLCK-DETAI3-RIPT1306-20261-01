const IngredientList = ({ ingredients }) => (
  <ul className="divide-y divide-stone-200 dark:divide-stone-700">
    {ingredients.map(({ name, quantity, unit }, i) => (
      <li key={`${name}-${i}`} className="flex justify-between py-2 text-sm">
        <span>{name}</span>
        <span className="font-medium">{quantity} {unit}</span>
      </li>
    ))}
  </ul>
);
export default IngredientList;
