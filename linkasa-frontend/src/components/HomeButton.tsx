export const HomeButton = ({
  children,
  variant = "primary",
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "icon";
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const baseClasses =
    "cursor-pointer rounded-full py-3 text-lg transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0";

  const variantClasses = {
    primary:
      "font-bold px-8 bg-white text-slate-800 shadow-[0px_3px_0px_0px_rgb(221,216,212)] hover:bg-slate-100",
    secondary:
      "font-bold px-8 bg-[#dbf881] text-slate-900 border-2 border-[#b2cf6b] shadow-[0px_3px_0px_0px_rgb(178,207,107)]",
    icon: "px-3 bg-black text-slate-800 shadow-[0px_3px_0px_0px_rgb(221,216,212)]",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
