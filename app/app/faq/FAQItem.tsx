'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-4 flex items-start justify-between text-left gap-4 hover:text-violet-600 transition-colors"
      >
        <span className="font-medium text-gray-900">{q}</span>
        {open ? <ChevronUp className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" /> : <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />}
      </button>
      {open && (
        <div className="pb-4 text-gray-600 text-sm leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}