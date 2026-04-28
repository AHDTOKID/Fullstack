export default function FeedbackCard({ feedback, offset = false }) {
  const person = feedback.from || feedback.to;
  const date = new Date(feedback.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={`group rounded-3xl p-8 transition-all duration-300
        ${
          offset
            ? 'bg-surface-container-low border-l-4 border-primary ml-0 md:ml-8 hover:bg-surface-container-high'
            : 'bg-surface-container hover:bg-surface-container-high'
        }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          {person?.avatarUrl ? (
            <img
              src={person.avatarUrl}
              alt={person.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed font-bold font-headline">
              {person?.initials || '??'}
            </div>
          )}
          <div>
            <h4 className="font-bold text-primary font-headline">{person?.name}</h4>
            <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">
              {person?.title || 'Member'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex gap-1 text-on-tertiary-container mb-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className="material-symbols-outlined text-[18px]"
                style={{
                  fontVariationSettings: `'FILL' ${feedback.rating >= s ? 1 : 0}`,
                }}
              >
                star
              </span>
            ))}
          </div>
          <span className="text-[10px] font-medium text-secondary">{date}</span>
        </div>
      </div>

      <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
        "{feedback.comment}"
      </p>

      <div className="flex flex-wrap gap-3 items-center">
        {feedback.tags?.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold uppercase"
          >
            {tag}
          </span>
        ))}
        {feedback.course && (
          <span className="px-3 py-1 bg-surface-container-highest text-primary font-bold rounded-full text-[10px] uppercase">
            {feedback.course}
          </span>
        )}
        {feedback.status === 'draft' && (
          <span className="px-3 py-1 bg-error-container text-error rounded-full text-[10px] font-bold uppercase">
            Draft
          </span>
        )}
      </div>
    </div>
  );
}
