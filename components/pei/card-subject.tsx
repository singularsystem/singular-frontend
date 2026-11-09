import { Card, CardHeader, CardTitle } from "../ui/card";

type Props = {
  title: string;
  icon: any;
  iconClassName?: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  subtitle?: string;
};

export function PEICardSubject({
  title,
  icon: Icon,
  iconClassName,
  selected,
  onClick,
  disabled,
  subtitle,
}: Props) {
  return (
    <Card
      aria-disabled={disabled}
      className={[
        "shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 transform",
        disabled
          ? "opacity-60 cursor-not-allowed pointer-events-none"
          : "hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] hover:-translate-y-1 cursor-pointer",
        selected ? "ring-2 ring-blue-500" : "",
      ].join(" ")}
      onClick={() => {
        if (disabled) return;
        onClick?.();
      }}
    >
      <CardHeader className="flex flex-col items-center mb-6">
        <div
          className={`h-16 w-16 rounded-full border flex items-center justify-center mb-4 ${
            iconClassName ?? ""
          }`}
        >
          <Icon className="h-8 w-8" />
        </div>

        <CardTitle className="text-center">{title}</CardTitle>

        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1 text-center">
            {subtitle}
          </p>
        )}
      </CardHeader>
    </Card>
  );
}
