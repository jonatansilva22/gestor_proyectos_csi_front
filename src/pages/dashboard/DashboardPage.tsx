import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { getDashboardData } from "../../services/dashboard/DashboardService";
import HeaderSidebarLayout from "../../components/common/HeaderSidebarLayout";
import { useTheme } from "../../context/ThemeContext";

ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels);

export default function Dashboard() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [grupos, setGrupos] = useState<any[]>([]);
  const { darkMode } = useTheme();

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
    Activo: "#22c55e",
    Inactivo: "#facc15",
    Completado: "#3b82f6",
  };

  const proyectosData = {
    labels: proyectos.map((p: any) => p.nombre),
    datasets: [
      {
        data: proyectos.map((p: any) => p.total),
        backgroundColor: proyectos.map((p: any) => {
          const key =
            p.nombre.charAt(0).toUpperCase() +
            p.nombre.slice(1).toLowerCase();
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
      legend: {
        labels: {
          color: darkMode ? "#e5e7eb" : "#374151",
        },
      },
    },
  };

  return (
    <HeaderSidebarLayout headerTitle="CSI PRO - Dashboard">
      <div
        className={`max-w-7xl mx-auto p-6 min-h-screen transition-colors ${
          darkMode ? "bg-[#1A0F30]" : "bg-gray-50"
        }`}
      >
        <h2
          className={`text-3xl font-bold mb-10 text-center ${
            darkMode ? "text-purple-300" : "text-purple-600"
          }`}
        >
          Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Usuarios */}
          <div
            className={`rounded-2xl shadow-lg p-6 transition ${
              darkMode
                ? "bg-gray-800 border border-gray-700 text-gray-200"
                : "bg-white border border-gray-200 text-gray-800"
            }`}
          >
            <h3 className="text-xl font-semibold mb-4 text-center">Usuarios</h3>
            <Pie data={usuariosData} options={pieOptions} />
          </div>

          {/* Proyectos */}
          <div
            className={`rounded-2xl shadow-lg p-6 transition ${
              darkMode
                ? "bg-gray-800 border border-gray-700 text-gray-200"
                : "bg-white border border-gray-200 text-gray-800"
            }`}
          >
            <h3 className="text-xl font-semibold mb-4 text-center">Proyectos</h3>
            <Pie data={proyectosData} options={pieOptions} />
          </div>

          {/* Grupos */}
          <div
            className={`rounded-2xl shadow-lg p-6 flex flex-col items-center transition ${
              darkMode
                ? "bg-gray-800 border border-gray-700 text-gray-200"
                : "bg-white border border-gray-200 text-gray-800"
            }`}
          >
            <h3 className="text-xl font-semibold mb-4">Grupos</h3>
            <p
              className={`text-4xl font-bold ${
                darkMode ? "text-purple-300" : "text-purple-600"
              }`}
            >
              {grupos.length}
            </p>

            {/* Lista con scroll si hay muchos grupos */}
            <div className="mt-6 w-full max-h-64 overflow-y-auto pr-2">
              <ul className="space-y-2 text-center">
                {grupos.map((grupo) => (
                  <li
                    key={grupo.id}
                    className={`py-2 rounded-lg transition ${
                      darkMode
                        ? "bg-gray-700 text-gray-200"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {grupo.nombre}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </HeaderSidebarLayout>
  );
}
