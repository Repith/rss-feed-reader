import { ReactNode } from "react";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

export function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="p-6 transition-all bg-white border rounded-lg border-primary-200 shadow-glossy hover:shadow-glossy-hover dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-glossy-light dark:bg-primary-900/30">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-primary-700 dark:text-primary-400">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
