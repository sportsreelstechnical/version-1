export interface League {
  id: string;
  name: string;
  country: string;
  sport: string;
  divisions?: string[];
}

export const leagues: League[] = [
  // Nigeria - Football
  {
    id: 'ng-mpfl',
    name: 'MPFL',
    country: 'NG',
    sport: 'football',
    divisions: ['Division 1', 'Division 2']
  },
  {
    id: 'ng-nlo',
    name: 'NLO',
    country: 'NG',
    sport: 'football',
    divisions: ['Division 1', 'Division 2', 'Division 3']
  },
  {
    id: 'ng-metro',
    name: 'Nigeria Metro League',
    country: 'NG',
    sport: 'football',
    divisions: ['Premier', 'Division 1']
  },
  {
    id: 'ng-nnl',
    name: 'NNL',
    country: 'NG',
    sport: 'football',
    divisions: ['Group A', 'Group B']
  },
  {
    id: 'ng-ato',
    name: 'ATO Cup',
    country: 'NG',
    sport: 'football',
    divisions: ['Preliminary', 'Main Draw']
  },
  {
    id: 'ng-valjets',
    name: 'VALJETS Cup',
    country: 'NG',
    sport: 'football',
    divisions: ['Preliminary', 'Main Draw']
  },
  {
    id: 'ng-discovery',
    name: 'Discovery Cup',
    country: 'NG',
    sport: 'football',
    divisions: ['Open']
  },

  // United Kingdom - Football
  {
    id: 'gb-premier',
    name: 'Premier League',
    country: 'GB',
    sport: 'football',
    divisions: ['Top Division']
  },
  {
    id: 'gb-championship',
    name: 'EFL Championship',
    country: 'GB',
    sport: 'football',
    divisions: ['Championship']
  },
  {
    id: 'gb-league-one',
    name: 'EFL League One',
    country: 'GB',
    sport: 'football',
    divisions: ['League One']
  },
  {
    id: 'gb-league-two',
    name: 'EFL League Two',
    country: 'GB',
    sport: 'football',
    divisions: ['League Two']
  },

  // Spain - Football
  {
    id: 'es-laliga',
    name: 'La Liga',
    country: 'ES',
    sport: 'football',
    divisions: ['Primera División']
  },
  {
    id: 'es-segunda',
    name: 'La Liga 2',
    country: 'ES',
    sport: 'football',
    divisions: ['Segunda División']
  },

  // Germany - Football
  {
    id: 'de-bundesliga',
    name: 'Bundesliga',
    country: 'DE',
    sport: 'football',
    divisions: ['1. Bundesliga']
  },
  {
    id: 'de-bundesliga2',
    name: '2. Bundesliga',
    country: 'DE',
    sport: 'football',
    divisions: ['2. Bundesliga']
  },

  // Italy - Football
  {
    id: 'it-seriea',
    name: 'Serie A',
    country: 'IT',
    sport: 'football',
    divisions: ['Serie A']
  },
  {
    id: 'it-serieb',
    name: 'Serie B',
    country: 'IT',
    sport: 'football',
    divisions: ['Serie B']
  },

  // France - Football
  {
    id: 'fr-ligue1',
    name: 'Ligue 1',
    country: 'FR',
    sport: 'football',
    divisions: ['Ligue 1']
  },
  {
    id: 'fr-ligue2',
    name: 'Ligue 2',
    country: 'FR',
    sport: 'football',
    divisions: ['Ligue 2']
  },

  // United States - Basketball
  {
    id: 'us-nba',
    name: 'NBA',
    country: 'US',
    sport: 'basketball',
    divisions: ['Eastern Conference', 'Western Conference']
  },
  {
    id: 'us-gleague',
    name: 'G League',
    country: 'US',
    sport: 'basketball',
    divisions: ['East', 'West']
  },

  // United States - American Football
  {
    id: 'us-nfl',
    name: 'NFL',
    country: 'US',
    sport: 'american-football',
    divisions: ['AFC', 'NFC']
  },

  // Generic options for countries without specific leagues
  {
    id: 'generic-football-pro',
    name: 'Professional League',
    country: 'GENERIC',
    sport: 'football',
    divisions: ['Division 1', 'Division 2', 'Division 3']
  },
  {
    id: 'generic-football-semi',
    name: 'Semi-Professional League',
    country: 'GENERIC',
    sport: 'football',
    divisions: ['Division 1', 'Division 2']
  },
  {
    id: 'generic-football-amateur',
    name: 'Amateur League',
    country: 'GENERIC',
    sport: 'football',
    divisions: ['Open Division']
  },
  {
    id: 'generic-basketball-pro',
    name: 'Professional League',
    country: 'GENERIC',
    sport: 'basketball',
    divisions: ['Division 1', 'Division 2']
  },
  {
    id: 'generic-other-pro',
    name: 'Professional League',
    country: 'GENERIC',
    sport: 'OTHER',
    divisions: ['Division 1', 'Division 2']
  },
  {
    id: 'generic-other-amateur',
    name: 'Amateur League',
    country: 'GENERIC',
    sport: 'OTHER',
    divisions: ['Open Division']
  }
];

export const getLeaguesForCountryAndSport = (countryCode: string, sportId: string): League[] => {
  // First try to get country-specific leagues
  const countryLeagues = leagues.filter(
    league => league.country === countryCode && (league.sport === sportId || league.sport === 'OTHER')
  );

  // If no country-specific leagues, return generic ones
  if (countryLeagues.length === 0) {
    return leagues.filter(
      league => league.country === 'GENERIC' && (league.sport === sportId || league.sport === 'OTHER')
    );
  }

  return countryLeagues;
};

export const getDivisionsForLeague = (leagueId: string): string[] => {
  const league = leagues.find(l => l.id === leagueId);
  return league?.divisions || ['Division 1'];
};
