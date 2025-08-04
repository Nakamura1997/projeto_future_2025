"use client";

import Image from "next/image";
import logo from "@/assets/logo3.png";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FiLogOut,
  FiHome,
  FiBarChart2,
  FiFileText,
  FiUsers,
} from "react-icons/fi";
import Link from "next/link";
import "@/styles/SideBar.css";
import Header from "./Header";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("sidebarCollapsed");
      return savedState ? JSON.parse(savedState) : false;
    }
    return false;
  });

  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    type: string;
    role: string;
  }>({
    name: "",
    type: "",
    role: "",
  });

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          name: parsedUser.nome || "Usuário",
          type: parsedUser.role || "Tipo não definido",
          role: parsedUser.role || "",
        });
      } catch (error) {
        setUser({ name: "", type: "", role: "" });
        console.error("Erro ao fazer parse do user no localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const getMenuItems = () => {
    let effectiveRole = user.role;

    // Se for funcionario, usa as rotas de analista
    if (effectiveRole === "funcionario") {
      effectiveRole = "analista";
    }

    switch (effectiveRole) {
      case "analista":
      case "gestor":
        return [
          {
            name: "Home",
            icon: <FiHome size={20} />,
            path: `/${effectiveRole}`,
          },
          {
            name: "Análises",
            icon: <FiBarChart2 size={20} />,
            path: `/${effectiveRole}/analises`,
          },
          {
            name: "Relatórios",
            icon: <FiFileText size={20} />,
            path: `/${effectiveRole}/relatorios`,
          },
          {
            name: "Cadastros",
            icon: <FiUsers size={20} />,
            path: `/${effectiveRole}/cadastros`,
          },
        ];
      case "cliente":
        return [
          { name: "Home", icon: <FiHome size={20} />, path: "/cliente" },
          {
            name: "Formulário",
            icon: <FiFileText size={20} />,
            path: "/cliente/formulario",
          },
          {
            name: "Relatórios",
            icon: <FiFileText size={20} />,
            path: "/cliente/relatorios",
          },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  if (isMobile) {
    return (
      <div>
        <Header className="isMobile" />
        <nav
          className="mobile-footer-nav"
          role="navigation"
          aria-label="Menu inferior"
        >
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className={`footer-icon ${
                pathname === item.path ? "active" : ""
              }`}
              aria-label={item.name}
            >
              {item.icon}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="footer-icon logout"
            aria-label="Sair"
          >
            <FiLogOut size={22} />
          </button>
        </nav>
      </div>
    );
  }

  return (
    <div data-testid="sidebar">
      <Header className={isCollapsed ? "collapsed-header" : ""} />
      <div
        id="sidebar"
        className={`sidebar ${isCollapsed ? "collapsed" : ""}`}
        role="navigation"
        aria-label="Menu lateral"
      >
        {!isCollapsed && (
          <div className="user-section">
            <Image
              src={logo}
              alt="Logo da Empresa"
              className="user-avatar"
              width={60}
              height={60}
            />
            <p className="user-name" data-testid="user-name">
              {user.name || "Usuário"}
            </p>
            <p className="user-type" data-testid="user-type">
              {user.type || "Tipo não definido"}
            </p>
          </div>
        )}

        <nav className="menu-items">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className={`menu-link ${pathname === item.path ? "active" : ""}`}
              aria-current={pathname === item.path ? "page" : undefined}
            >
              {item.icon}
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="logout-section">
          <button
            className="logout-button"
            onClick={handleLogout}
            aria-label="Sair da conta"
          >
            <FiLogOut size={20} aria-hidden="true" />
            {!isCollapsed && <span>Sair</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
