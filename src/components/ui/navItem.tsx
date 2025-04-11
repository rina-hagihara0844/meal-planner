import Link from "next/link";
import { Home, Calendar, Book, ShoppingCart, Database } from "lucide-react";

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
}

export default function NavItem({ href, icon, label }: NavItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-emerald-600"
    >
      <span className="flex-shrink-0">{getIcon(icon)}</span>
      <span className="hidden md:block">{label}</span>
    </Link>
  );
}

function getIcon(icon: string) {
  switch (icon) {
    case "home":
      return <Home />;
    case "calendar":
      return <Calendar />;
    case "book":
      return <Book />;
    case "shopping-cart":
      return <ShoppingCart />;
    case "database":
      return <Database />;
    default:
      return null;
  }
}
