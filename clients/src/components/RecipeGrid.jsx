import RecipeCard from './RecipeCard.jsx';

const RecipeGrid = ({ recipes, renderActions }) => (
  <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
    {recipes.map((r) => (
      <li key={r._id}>
        <RecipeCard recipe={r}>{renderActions?.(r)}</RecipeCard>
      </li>
    ))}
  </ul>
);
export default RecipeGrid;
