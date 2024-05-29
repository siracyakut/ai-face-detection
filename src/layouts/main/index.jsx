import { Outlet } from "react-router-dom";
import { CircleX } from "lucide-react";
import Header from "~/layouts/main/header";
import Footer from "~/layouts/main/footer";
import { useApp } from "~/store/app/hooks";

export default function MainLayout() {
  const { error } = useApp();

  return (
    <div className="min-h-full max-w-[1500px] w-full mx-auto p-4 md:px-0 flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col w-full h-full">
        {error && (
          <div className="fixed inset-0 backdrop-blur flex items-center justify-center z-10">
            <div className="bg-red-200 text-red-700 border border-red-700 px-4 py-2 w-max flex items-center gap-x-4 rounded-md">
              <CircleX />
              <p>Geçersiz dosya yüklediniz!</p>
            </div>
          </div>
        )}
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}
