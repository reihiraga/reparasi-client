import { FileText, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Toko Reparasi APL
              </h1>
            </div>
            <Link
              to="/login"
              className="flex items-center px-4 py-2 space-x-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <LogIn className="w-5 h-5" />
              <span>Login Karyawan</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Selamat datang di Toko Reparasi APL
          </h2>
          <p className="mb-8 text-xl text-gray-600">
            Cara yang aman dan efisien untuk memperbaiki perangkat Anda!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-xl font-semibold">Kontak</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Email:</span>{" "}
                <a href="mailto:support@notes.com" className="text-blue-600">
                  repair@metrodata.academy
                </a>
              </p>
              <p>
                <span className="font-medium">Telepon:</span> (+62)
                812-3456-7890
              </p>
              <p>
                <span className="font-medium">Jam Kerja:</span> Senin-Jumat,
                8am-5pm WIB
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-xl font-semibold">Layanan Kami</h3>
            <ul className="space-y-2">
              <li>✓ Perbaikan Computer</li>
              <li>✓ Servis Smartphone</li>
              <li>✓ Solusi Jaringan</li>
              <li>✓ Recovery Data</li>
              <li>✓ Upgrade Hardware</li>
              <li>✓ Instalasi Software</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
