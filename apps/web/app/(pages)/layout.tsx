import { Toaster } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import { SiteHeader } from "@/components/site-header";

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    org?: string;
    slug?: string;
  };
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  return (
    <TooltipProvider>
      <div className="relative flex min-h-screen flex-col">
        <div className="grid grow lg:grid-cols-5">
          <Sidebar
            params={params}
            className="fixed flex w-12 flex-col justify-between transition-[width] duration-1000 lg:w-64"
          />
          <div className="col-span-full ml-12 border-l h-full transition-[margin] duration-1000 lg:ml-64">
            <SiteHeader />

            {children}
          </div>
        </div>
        {/* <Toaster position="top-center" /> */}
      </div>
    </TooltipProvider>
  );
}
