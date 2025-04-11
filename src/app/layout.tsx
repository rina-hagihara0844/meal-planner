//import "./globals.css";
import type { Metadata } from "next";
//import { Inter } from "next/font/google";
import NavItem from "@/components/ui/navItem";

//const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "meal-planner - 献立管理アプリ",
  description: "献立管理、レシピ管理、買い物リスト管理を一元化するアプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div className="min-h-screen bg-gray-50 flex">
          {/*サイドバー*/}
          <aside className="w-16 md:w-64 bg-white border-r shadow-sm flex flex-col">
            <div className="p-4 border-b flex items-center">
              <div className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                M
              </div>
              <span className="text-xl font-bold hidden md:block">
                Meal Planner
              </span>
            </div>
            <nav className="flex-1 p-2 space-y-1">
              <NavItem href="/dashboard" icon="home" label="Home" />
              <NavItem href="/meals" icon="calendar" label="Meal" />
              <NavItem href="/recipe" icon="book" label="Recipe" />
              <NavItem href="/shopping" icon="shopping-cart" label="Shopping" />
              <NavItem
                href="/ingredients"
                icon="database"
                label="Ingredients"
              />
            </nav>
            <div className="p-4 border-t mt-auto">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gray-200 rounded-full mr-3"></div>
                <div className="hidden md:block">
                  <p className="font-medium text-sm">User Name</p>
                  <p className="text-xs text-gray-500">Settings</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}