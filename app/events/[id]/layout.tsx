import { Suspense } from "react";

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<p>Loading event...</p>}>
      {children}
    </Suspense>
  );
}