import Link from "next/link";

const navItems = [
  { name: "Home", url: "/" },
  { name: "About", url: "/about" },
  { name: "Projects", url: "/projects" },
  { name: "Credits", url: "/credits" },
  { name: "Register", url: "/register" },
];

export function ServerNavBar() {
  return (
    <div className="server-navbar fixed top-6 left-1/2 -translate-x-1/2 z-[9999]" style={{ zIndex: 10000 }}>
      <div className="flex items-center gap-3 bg-white/10 border border-white/20 backdrop-blur-md py-1 px-1 rounded-full shadow-lg">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.url}
            className="relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors text-gray-800 hover:text-gray-600 hover:bg-white/20"
          >
            <span className="block">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
