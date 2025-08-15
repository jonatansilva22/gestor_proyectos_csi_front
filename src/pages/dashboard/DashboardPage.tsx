import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { getDashboardData } from "../../services/dashboard/DashboardService";
import HeaderSidebarLayout from "../../components/common/HeaderSidebarLayout";

ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels);

export default function Dashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [grupos, setGrupos] = useState<any[]>([]); // Cambiado a array

useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getDashboardData();
      setUsuarios(data.Usuarios);
      setProyectos(data.Proyectos);
      setGrupos(data.Grupos);
    } catch (error) {
      console.error("Error al cargar el dashboard:", error);
    }
  };
  fetchData();
}, []);

  const usuariosData = {
    labels: usuarios.map((u: any) => u.nombre),
    datasets: [
      {
        data: usuarios.map((u: any) => u.total),
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      },
    ],
  };

  const PROJECT_STATUS_COLORS_BG: Record<string, string> = {
    Activo: "#22c55e",    // verde
    Inactivo: "#facc15",  // amarillo
    Completado: "#3b82f6" // azul
  };

  const proyectosData = {
    labels: proyectos.map((p: any) => p.nombre),
    datasets: [
      {
        data: proyectos.map((p: any) => p.total),
        backgroundColor: proyectos.map((p: any) => {
          const key = p.nombre.charAt(0).toUpperCase() + p.nombre.slice(1).toLowerCase();
          return PROJECT_STATUS_COLORS_BG[key] || "#cccccc";
        }),
      },
    ],
  };

  const pieOptions = {
    plugins: {
      datalabels: {
        formatter: (value: number, ctx: any) => {
          const dataArr = ctx.chart.data.datasets[0].data;
          const sum = dataArr.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / sum) * 100).toFixed(1) + "%";
          return value > 0 ? percentage : "";
        },
        color: "#fff",
        font: { weight: "bold" as "bold", size: 14 },
      },
    },
  };

  return (
    <HeaderSidebarLayout headerTitle="CSI PRO - Dashboard">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">Dashboard</h2>
        <div className="flex flex-col md:flex-row gap-12 md:gap-6 justify-center items-start">
          {/* Usuarios */}
          <div className="bg-white rounded-lg shadow p-4 flex-1">
            <h3 className="text-lg font-semibold mb-4">Usuarios</h3>
            <Pie data={usuariosData} options={pieOptions} />
          </div>

          {/* Proyectos */}
          <div className="bg-white rounded-lg shadow p-4 flex-1">
            <h3 className="text-lg font-semibold mb-4">Proyectos</h3>
            <Pie data={proyectosData} options={pieOptions} />
          </div>

          {/* Grupos */}
          <div className="bg-white rounded-lg shadow p-4 flex-1 text-center">
            <h3 className="text-lg font-semibold mb-4">Grupos</h3>
            <p className="text-2xl font-bold">{grupos.length}</p>
            <ul className="mt-4 space-y-2">
              {grupos.map((grupo) => (
                <li key={grupo.id} className="text-base text-gray-700">{grupo.nombre}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </HeaderSidebarLayout>
  );
}