import logo from "../../assets/logo-csi.png";
import menu from "../../assets/menu.png";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

 const Header = ({ title, onMenuClick }: HeaderProps) => (
  <header className="w-full bg-purple-700 flex items-center h-14 px-6 relative">
    <button
      onClick={onMenuClick}
      aria-label="Abrir menú"
      className="absolute left-4 top-1/2 -translate-y-1/2 focus:outline-none"
    >
      <img src={menu} alt="Menú" className="h-6 w-6" />
    </button>

    <div className="flex items-center ml-12">
      <img src={logo} alt="Logo" className="h-8 w-8 mr-3" />
      <span className="text-white text-xl font-normal">{title}</span>
    </div>
  </header>
);

export default Header;
