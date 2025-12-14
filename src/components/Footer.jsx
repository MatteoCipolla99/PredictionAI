import { BarChart3 } from "lucide-react";

const Footer = ({ apiConnected }) => {
  return (
    <footer className="border-t border-blue-800/30 bg-slate-900/50 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              StatsCalcio AI
            </h4>
            <p className="text-sm text-gray-400">
              Piattaforma con integrazione API reale per statistiche e analisi
              calcistiche con intelligenza artificiale.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Funzionalità</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Dati live da API-Football</li>
              <li>• Predizioni AI in tempo reale</li>
              <li>• Statistiche avanzate</li>
              <li>• Notifiche personalizzate</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">API Integration</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• API-Football (RapidAPI)</li>
              <li>• Aggiornamenti real-time</li>
              <li>• Partite live</li>
              <li>• Statistiche squadre</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Supporto</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Documentazione API</li>
              <li>• Setup Guide</li>
              <li>• FAQ</li>
              <li>• Contatti</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800/30 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            © 2024 StatsCalcio AI - Powered by API-Football & Advanced Machine
            Learning
          </p>
          <p className="mt-2 text-xs">
            Le quote e statistiche sono fornite a scopo informativo. API Status:{" "}
            {apiConnected ? "🟢 Connected" : "🟡 Demo Mode"}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
