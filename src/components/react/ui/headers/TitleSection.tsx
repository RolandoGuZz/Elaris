interface PropsTitleSection {
  title: string;
  subtitle: string;
}
export const TitleSection = ({ title, subtitle }: PropsTitleSection) => {
  return (
    <div className=" text-left py-6 mb-3 border-b border-slate-100 dark:border-slate-800 dark:bg-slate-900/50">
      <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">
        {subtitle}
      </p>
    </div>
  );
};
