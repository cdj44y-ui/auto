import { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-stone-900">{title}</h3>
      <p className="text-sm text-stone-500 mt-1 text-center max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
