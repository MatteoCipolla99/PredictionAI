export const useDemoData = () => {
  const today = new Date().toISOString();

  const getDemoMatches = () => [
    {
      id: 1,
      home: "Inter",
      away: "Milan",
      time: "20:45",
      date: today,
      homeOdds: 2.1,
      drawOdds: 3.4,
      awayOdds: 3.6,
      aiPrediction: "Casa",
      confidence: 78,
      stats: {
        homeForm: 85,
        awayForm: 72,
        homePoints: 48,
        awayPoints: 31,
        h2h: "60% Casa",
      },
      status: "NS",
      statusLong: "Not Started",
      venue: "San Siro",
      city: "Milano",
      homeLogo: "https://media.api-sports.io/football/teams/505.png",
      awayLogo: "https://media.api-sports.io/football/teams/489.png",
      leagueName: "Serie A",
      homeId: 505,
      awayId: 489,
    },
    {
      id: 2,
      home: "Juventus",
      away: "Napoli",
      time: "18:00",
      date: today,
      homeOdds: 2.25,
      drawOdds: 3.2,
      awayOdds: 3.3,
      aiPrediction: "X",
      confidence: 65,
      stats: {
        homeForm: 78,
        awayForm: 80,
        homePoints: 38,
        awayPoints: 41,
        h2h: "45% Pareggi",
      },
      status: "NS",
      statusLong: "Not Started",
      venue: "Allianz Stadium",
      city: "Torino",
      homeLogo: "https://media.api-sports.io/football/teams/496.png",
      awayLogo: "https://media.api-sports.io/football/teams/492.png",
      leagueName: "Serie A",
      homeId: 496,
      awayId: 492,
    },
  ];

  const getDemoLiveMatches = () => [];

  const getDemoH2hData = () => ({
    totalMatches: 10,
    team1Wins: 4,
    team2Wins: 3,
    draws: 3,
    team1WinPercentage: "40.0",
    team2WinPercentage: "30.0",
    drawPercentage: "30.0",
    avgGoals: "2.5",
    over25Percentage: "50.0",
    bttsPercentage: "60.0",
    lastMatches: [],
  });

  const getDemoStandings = () => [];

  return {
    getDemoMatches,
    getDemoLiveMatches,
    getDemoH2hData,
    getDemoStandings,
  };
};
