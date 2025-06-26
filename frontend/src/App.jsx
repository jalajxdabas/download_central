import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MetadataTable from './components/metaDataTable';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-100 text-slate-800 font-sans">
      <Navbar />
      <main className="flex-grow px-6 py-10">
        <h1 className="text-3xl font-semibold text-violet-600 mb-6 text-center">
          File Metadata
        </h1>
        <MetadataTable />
      </main>
      <Footer />
    </div>
  );
}
