import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLeaderboardData } from '@/hooks/useLeaderboardData';
import { useGamesData, Game, GameResult } from '@/hooks/useGamesData';
import { Loader2, AlertCircle, Gamepad2, Search, Calendar, Users, Trophy, Medal, Crown, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Jogos = () => {
  const { data: leaderboardData, loading: leaderboardLoading, error: leaderboardError } = useLeaderboardData();
  const { data: gamesData, isLoading: gamesLoading, error: gamesError } = useGamesData();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'byEvent' | 'byParticipant'>('byEvent');

  const loading = leaderboardLoading || gamesLoading;
  const error = leaderboardError || (gamesError ? gamesError.message : null);

  // Helper to get participant name by ID
  const getParticipantName = (participantId: number): string => {
    const participant = leaderboardData?.participants.find(p => p.id === participantId);
    return participant?.name || `Participante #${participantId}`;
  };

  // Sort games by date (most recent first)
  const sortedGames = [...(gamesData?.games || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter games by participant name in search
  const filteredGames = sortedGames.filter(game => {
    if (!searchQuery) return true;
    const participantNames = game.results.map(r => getParticipantName(r.participantId).toLowerCase());
    return participantNames.some(name => name.includes(searchQuery.toLowerCase())) ||
           game.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Calculate participant game summaries for "by participant" view
  const participantSummaries = (() => {
    const summaryMap = new Map<number, {
      participantId: number;
      totalPoints: number;
      gamesPlayed: number;
      gameHistory: { game: Game; result: GameResult }[];
    }>();

    gamesData?.games.forEach(game => {
      game.results.forEach(result => {
        const existing = summaryMap.get(result.participantId) || {
          participantId: result.participantId,
          totalPoints: 0,
          gamesPlayed: 0,
          gameHistory: [],
        };
        existing.totalPoints += result.points;
        existing.gamesPlayed += 1;
        existing.gameHistory.push({ game, result });
        summaryMap.set(result.participantId, existing);
      });
    });

    return Array.from(summaryMap.values())
      .filter(summary => {
        if (!searchQuery) return true;
        const name = getParticipantName(summary.participantId).toLowerCase();
        return name.includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => b.totalPoints - a.totalPoints);
  })();

  // Calculate totals
  const totalGames = gamesData?.games.length || 0;
  const totalPointsDistributed = gamesData?.games.reduce(
    (acc, game) => acc + game.results.reduce((sum, r) => sum + r.points, 0),
    0
  ) || 0;

  // Format date in Portuguese
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get medal icon for position
  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 2:
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 3:
        return <Medal className="w-4 h-4 text-amber-600" />;
      default:
        return <span className="w-4 h-4 flex items-center justify-center text-xs text-muted-foreground">{position}o</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Carregando jogos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="card-royal p-6 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Erro ao carregar</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden royal-gradient py-16 sm:py-20">
          <div className="container px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/40 mb-6">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Gincanas</span>
                <Crown className="w-4 h-4 text-accent" />
              </div>

              <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary-foreground mb-4">
                Jogos na Embaixada
              </h1>

              <p className="text-lg text-primary-foreground/90 mb-4 flex items-center justify-center gap-3">
                <Gamepad2 className="w-5 h-5 text-accent" />
                <span>Pontuacoes de brincadeiras e gincanas</span>
              </p>

              <div className="flex items-center justify-center gap-6 text-sm text-primary-foreground/60">
                <span>{totalGames} jogo{totalGames !== 1 ? 's' : ''} realizado{totalGames !== 1 ? 's' : ''}</span>
                <span>|</span>
                <span>{totalPointsDistributed} pontos distribuidos</span>
              </div>
            </div>
          </div>
        </section>

        {/* Controls Section */}
        <section className="py-8 border-b bg-muted/30">
          <div className="container px-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between max-w-4xl mx-auto">
              {/* Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'byEvent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('byEvent')}
                  className={viewMode === 'byEvent' ? 'bg-primary text-primary-foreground' : ''}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Por Evento
                </Button>
                <Button
                  variant={viewMode === 'byParticipant' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('byParticipant')}
                  className={viewMode === 'byParticipant' ? 'bg-primary text-primary-foreground' : ''}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Por Participante
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Games Section */}
        <section className="py-12">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              {viewMode === 'byEvent' ? (
                /* By Event View */
                filteredGames.length === 0 ? (
                  <div className="text-center py-12">
                    <Gamepad2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {searchQuery ? 'Nenhum resultado encontrado' : 'Nenhum jogo ainda'}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 'Tente outro termo de busca' : 'Os jogos realizados aparecerao aqui'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredGames.map((game) => (
                      <div
                        key={game.id}
                        className="card-royal p-6 animate-fade-in"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
                              <Gamepad2 className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-primary">
                                {game.name}
                              </h3>
                              {game.description && (
                                <p className="text-sm text-muted-foreground">{game.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(game.date)}
                          </div>
                        </div>

                        {/* Results Table */}
                        <div className="space-y-2">
                          {game.results
                            .sort((a, b) => a.position - b.position)
                            .map((result) => (
                              <div
                                key={`${game.id}-${result.participantId}`}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
                              >
                                <div className="flex items-center gap-3">
                                  {getMedalIcon(result.position)}
                                  <span className="font-medium">{getParticipantName(result.participantId)}</span>
                                </div>
                                <span className="text-sm text-accent font-semibold">+{result.points} pts</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* By Participant View */
                participantSummaries.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {searchQuery ? 'Nenhum resultado encontrado' : 'Nenhum participante ainda'}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 'Tente outro termo de busca' : 'Os participantes dos jogos aparecerao aqui'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {participantSummaries.map((summary) => (
                      <div
                        key={summary.participantId}
                        className="card-royal p-6 animate-fade-in"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-primary">
                            {getParticipantName(summary.participantId)}
                          </h3>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">
                              {summary.gamesPlayed} jogo{summary.gamesPlayed !== 1 ? 's' : ''}
                            </span>
                            <span className="text-muted-foreground">|</span>
                            <span className="font-semibold text-accent">
                              +{summary.totalPoints} pts
                            </span>
                          </div>
                        </div>

                        {/* Game History */}
                        <div className="space-y-2">
                          {summary.gameHistory
                            .sort((a, b) => new Date(b.game.date).getTime() - new Date(a.game.date).getTime())
                            .map(({ game, result }) => (
                              <div
                                key={`${game.id}-${result.participantId}`}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
                              >
                                <div className="flex items-center gap-3">
                                  {getMedalIcon(result.position)}
                                  <div>
                                    <span className="font-medium">{game.name}</span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                      {formatDate(game.date)}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-sm text-accent font-semibold">+{result.points} pts</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Jogos;
