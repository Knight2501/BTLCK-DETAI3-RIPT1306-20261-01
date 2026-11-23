import { imageUrl } from '../utils/format.js';

const StepList = ({ steps }) => (
  <ol className="space-y-6">
    {steps.map((step, i) => (
      <li key={`${i}-${step.content.slice(0, 12)}`} className="flex gap-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 font-bold text-white">{i + 1}</span>
        <div className="flex-1">
          <p className="leading-relaxed">{step.content}</p>
          {step.image && <img src={imageUrl(step.image)} alt={`Bước ${i + 1}`} loading="lazy" className="mt-3 max-h-72 rounded-lg object-cover" />}
        </div>
      </li>
    ))}
  </ol>
);
export default StepList;
