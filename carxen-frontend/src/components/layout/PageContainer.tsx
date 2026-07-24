import { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
};

export default function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 pt-32 pb-10">
      {children}
    </main>
  );
}
