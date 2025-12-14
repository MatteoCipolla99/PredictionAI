import { useState } from "react";
import {
  User,
  Settings,
  CreditCard,
  LogOut,
  Crown,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, subscription, isPremium } = useAuth();

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg transition-all"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full border-2 border-blue-500"
        />
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium flex items-center gap-2">
            {user.name}
            {isPremium && <Crown className="w-4 h-4 text-yellow-400" />}
          </div>
          <div className="text-xs text-gray-400 capitalize">{subscription}</div>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-blue-800/30 rounded-xl shadow-xl z-50">
            {/* User Info */}
            <div className="p-4 border-b border-blue-800/30">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full border-2 border-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {user.name}
                    {isPremium && <Crown className="w-4 h-4 text-yellow-400" />}
                  </div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                </div>
              </div>
              {isPremium ? (
                <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-lg p-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">
                      Account Premium
                    </span>
                  </div>
                  <div className="text-gray-400 mt-1">
                    Accesso illimitato a tutte le funzionalità
                  </div>
                </div>
              ) : (
                <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-2 text-xs">
                  <div className="text-blue-400 font-medium">Account Free</div>
                  <div className="text-gray-400 mt-1">
                    Passa a Premium per funzionalità avanzate
                  </div>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg transition-all text-left">
                <User className="w-5 h-5 text-gray-400" />
                <span>Il mio Profilo</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg transition-all text-left">
                <Settings className="w-5 h-5 text-gray-400" />
                <span>Impostazioni</span>
              </button>
              {!isPremium && (
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg transition-all text-left">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400">Passa a Premium</span>
                </button>
              )}
              <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg transition-all text-left">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span>Fatturazione</span>
              </button>
            </div>

            {/* Stats */}
            <div className="p-4 border-t border-blue-800/30">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-800/50 rounded-lg p-2">
                  <div className="font-bold text-blue-400">156</div>
                  <div className="text-gray-400">Analisi</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2">
                  <div className="font-bold text-green-400">87%</div>
                  <div className="text-gray-400">Accuratezza</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2">
                  <div className="font-bold text-purple-400">+24%</div>
                  <div className="text-gray-400">ROI</div>
                </div>
              </div>
            </div>

            {/* Logout */}
            <div className="p-2 border-t border-blue-800/30">
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-600/20 text-red-400 rounded-lg transition-all text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Esci</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
