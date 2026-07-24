import { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
};

export default function PageContainer({
  children,
}: PageContainerProps) {
  return <>{children}</>;
}
