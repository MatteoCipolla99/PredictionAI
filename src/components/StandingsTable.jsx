const StandingsTable = ({ standings = [] }) => {
  if (standings.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-8 text-center">
        <p className="text-gray-400">Classifica non disponibile</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr className="text-left text-xs text-gray-400">
              <th className="p-4 font-semibold">#</th>
              <th className="p-4 font-semibold">Squadra</th>
              <th className="p-4 font-semibold text-center">G</th>
              <th className="p-4 font-semibold text-center">V</th>
              <th className="p-4 font-semibold text-center">P</th>
              <th className="p-4 font-semibold text-center">S</th>
              <th className="p-4 font-semibold text-center">GF</th>
              <th className="p-4 font-semibold text-center">GS</th>
              <th className="p-4 font-semibold text-center">DR</th>
              <th className="p-4 font-semibold text-center">Pt</th>
              <th className="p-4 font-semibold text-center">Forma</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, idx) => (
              <tr
                key={team.team.id}
                className={`border-t border-blue-800/20 hover:bg-slate-800/50 transition-all ${
                  idx < 4
                    ? "bg-green-900/10"
                    : idx < 6
                    ? "bg-blue-900/10"
                    : idx >= standings.length - 3
                    ? "bg-red-900/10"
                    : ""
                }`}
              >
                <td className="p-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      idx < 4
                        ? "bg-green-600/20 text-green-400"
                        : idx < 6
                        ? "bg-blue-600/20 text-blue-400"
                        : idx >= standings.length - 3
                        ? "bg-red-600/20 text-red-400"
                        : "bg-slate-700 text-gray-400"
                    }`}
                  >
                    {team.rank}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={team.team.logo}
                      alt={team.team.name}
                      className="w-8 h-8"
                    />
                    <span className="font-semibold">{team.team.name}</span>
                  </div>
                </td>
                <td className="p-4 text-center text-gray-400">
                  {team.all.played}
                </td>
                <td className="p-4 text-center text-green-400 font-semibold">
                  {team.all.win}
                </td>
                <td className="p-4 text-center text-gray-400">
                  {team.all.draw}
                </td>
                <td className="p-4 text-center text-red-400 font-semibold">
                  {team.all.lose}
                </td>
                <td className="p-4 text-center text-gray-300">
                  {team.all.goals.for}
                </td>
                <td className="p-4 text-center text-gray-300">
                  {team.all.goals.against}
                </td>
                <td className="p-4 text-center">
                  <span
                    className={
                      team.goalsDiff >= 0 ? "text-green-400" : "text-red-400"
                    }
                  >
                    {team.goalsDiff > 0 ? "+" : ""}
                    {team.goalsDiff}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-lg font-bold text-blue-400">
                    {team.points}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-1 justify-center">
                    {team.form
                      ?.split("")
                      .slice(-5)
                      .map((result, i) => (
                        <div
                          key={i}
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            result === "W"
                              ? "bg-green-600 text-white"
                              : result === "D"
                              ? "bg-gray-600 text-white"
                              : "bg-red-600 text-white"
                          }`}
                        >
                          {result}
                        </div>
                      ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="p-4 bg-slate-900/30 border-t border-blue-800/20">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span className="text-gray-400">Champions League</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span className="text-gray-400">Europa League</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span className="text-gray-400">Retrocessione</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandingsTable;
