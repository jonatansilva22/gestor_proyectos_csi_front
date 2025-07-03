import logo from '../../assets/logo-csi.png'; 

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => (
  <header className="w-full bg-purple-700 flex items-center h-14 px-6">
    <img src={logo} alt="Logo" className="h-8 w-8 mr-3" />
    <span className="text-white text-xl font-normal">{title}</span>
  </header>
);