import React from 'react';

const EmptyState = ({ icon = '🔍', title = 'Nothing here', description = '', action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>
    {description && <p className="text-slate-500 text-sm mb-6 max-w-xs">{description}</p>}
    {action && (
      <button onClick={action.onClick} className="btn-primary">
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;
