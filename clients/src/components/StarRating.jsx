
const StarRating = ({ value = 0, onChange, size = 'text-lg' }) => (
  <span className={`inline-flex ${size}`} role={onChange ? 'radiogroup' : 'img'} aria-label={`${value} trên 5 sao`}>
    {[1, 2, 3, 4, 5].map((n) => {
      const filled = n <= Math.round(value);
      const star = <span className={filled ? 'text-amber-400' : 'text-stone-300'}>★</span>;
      return onChange ? (
        <button key={n} type="button" role="radio" aria-checked={n === value} aria-label={`${n} sao`} onClick={() => onChange(n)}>
          {star}
        </button>
      ) : (
        <span key={n}>{star}</span>
      );
    })}
  </span>
);
export default StarRating;
