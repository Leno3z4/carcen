import { NavLink } from "react-router-dom";

const navigation = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Markets",
    href: "/",
  },
  {
    label: "Portfolio",
    href: "/portfolio",
  },
  {
    label: "Profile",
    href: "/profile",
  },
];

export default function Navbar() {
  return (
    <header className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
      <nav className="flex items-center gap-2 rounded-[20px] bg-neutral-900 px-3 py-3 shadow-lg">
        {navigation.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            className={({ isActive }) =>
              [
                "rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200",
                isActive
                  ? "bg-white text-neutral-900"
                  : "text-neutral-300 hover:bg-neutral-800 hover:text-white",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}

        <div className="ml-4 h-8 w-px bg-neutral-700" />

        <button
          type="button"
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
        >
          Connect Wallet
        </button>
      </nav>
    </header>
  );
}
