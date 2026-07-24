import { SelectHTMLAttributes } from "react";

type FilterSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export default function FilterSelect(props: FilterSelectProps) {
  return <select {...props} />;
}
