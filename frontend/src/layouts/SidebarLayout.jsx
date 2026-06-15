import { useState } from "react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Brain,
  FileText,
  History,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import Logo from "../layouts/SidebarLayout";

import { useAuth } from "../context/AuthContext";

/**
 * Shared Sidebar Layout
 */
function SidebarLayout({
  children,
  hideSidebar = false,
}) {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const [
    isSidebarOpen,
    setIsSidebarOpen,
  ] = useState(false);

  /**
   * Logout user
   */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /**
   * Navigation items
   */
  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon:
        LayoutDashboard,
    },
    {
      label: "AI Interview",
      path: "/interview",
      icon: Brain,
    },
    {
      label:
        "Resume Analyzer",
      path: "/resume",
      icon: FileText,
    },
    {
      label: "History",
      path: "/history",
      icon: History,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  /**
   * Sidebar Content
   */
  const SidebarContent = ({
    showLogo = true,
    }) => (
    <>
      {/* Logo */}
      {showLogo && (
        <div className="border-b border-[#e2e8f0] p-6">
            <button
            onClick={() =>
                navigate("/dashboard")
            }
            className="text-2xl font-bold text-[#2563eb]"
            >
            <Logo></Logo>
            </button>
        </div>
        )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <NavLink
                  key={
                    item.path
                  }
                  to={
                    item.path
                  }
                  onClick={() =>
                    setIsSidebarOpen(
                      false
                    )
                  }
                  className={({
                    isActive,
                  }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                      isActive
                        ? "bg-blue-50 font-medium text-[#2563eb]"
                        : "text-[#64748b] hover:bg-slate-50"
                    }`
                  }
                >
                  <Icon
                    size={
                      20
                    }
                  />

                  <span>
                    {
                      item.label
                    }
                  </span>
                </NavLink>
              );
            }
          )}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-[#e2e8f0] p-4">
        <div className="mb-4">
          <p className="truncate font-medium text-[#0f172a]">
            {user?.name ||
              "User"}
          </p>

          <p className="truncate text-sm text-[#64748b]">
            {user?.email ||
              "user@example.com"}
          </p>
        </div>

        <button
          onClick={
            handleLogout
          }
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[#64748b] transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut
            size={20}
          />

          <span>
            Logout
          </span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Mobile Navbar */}
      {!hideSidebar && (
        <header className="sticky top-0 z-40 border-b border-[#e2e8f0] bg-white md:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
              className="text-xl font-bold text-[#2563eb]"
            >
              <Logo></Logo>
            </button>

            <button
              onClick={() =>
                setIsSidebarOpen(
                  true
                )
              }
              className="text-[#0f172a]"
            >
              <Menu
                size={24}
              />
            </button>
          </div>
        </header>
      )}

      {/* Mobile Sidebar */}
      {!hideSidebar && isSidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() =>
              setIsSidebarOpen(
                false
              )
            }
          />

          {/* Drawer */}
          <aside className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-white shadow-xl md:hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] p-6">
              <button
                onClick={() => {
                  navigate(
                    "/dashboard"
                  );
                  setIsSidebarOpen(
                    false
                  );
                }}
                className="text-2xl font-bold text-[#2563eb]"
              >
                <Logo></Logo>
              </button>

              <button
                onClick={() =>
                  setIsSidebarOpen(
                    false
                  )
                }
              >
                <X
                  size={24}
                />
              </button>
            </div>

            <SidebarContent showLogo={false} />
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      {!hideSidebar && (
        <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-[#e2e8f0] bg-white md:flex">
          <SidebarContent />
        </aside>
      )}

      {/* Main Content */}
      <main className={hideSidebar ?  "" : "md:ml-64"}>
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default SidebarLayout;