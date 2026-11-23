import Loading from './Loading.jsx';
import ErrorMessage from './ErrorMessage.jsx';


const Section = ({ id, title, loading, error, onRetry, children }) => (
  <section aria-labelledby={id}>
    <h2 id={id} className="mb-3 text-xl font-bold">{title}</h2>
    {loading && <Loading />}
    {error && <ErrorMessage error={error} onRetry={onRetry} />}
    {!loading && !error && children}
  </section>
);
export default Section;
