import type { Winner } from '../api/client';
import './WinnersTable.css';

interface WinnersTableProps {
  winners: Winner[];
  currentUserId: number | null;
}

/** Таблица победителей аукциона */
export function WinnersTable({ winners, currentUserId }: WinnersTableProps) {
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Группируем победителей по раундам
  const winnersByRound = winners.reduce((acc, winner) => {
    if (!acc[winner.round]) {
      acc[winner.round] = [];
    }
    acc[winner.round].push(winner);
    return acc;
  }, {} as Record<number, Winner[]>);

  const rounds = Object.keys(winnersByRound)
    .map(Number)
    .sort((a, b) => a - b);

  if (winners.length === 0) {
    return (
      <div className="winners-empty">
        Победителей пока нет
      </div>
    );
  }

  return (
    <div className="winners-table-container">
      {rounds.map((round) => (
        <div key={round} className="winners-round-section">
          <h3 className="winners-round-title">Раунд {round}</h3>
          <div className="winners-list">
            {winnersByRound[round]
              .sort((a, b) => a.place - b.place)
              .map((winner) => {
                const isCurrentUser = currentUserId !== null && winner.userId === currentUserId;
                return (
                  <div 
                    key={`${winner.round}-${winner.userId}`} 
                    className={`winner-item ${isCurrentUser ? 'winner-current-user' : ''}`}
                  >
                    <div className="winner-place">
                      {winner.place === 1 && <span className="winner-medal gold">🥇</span>}
                      {winner.place === 2 && <span className="winner-medal silver">🥈</span>}
                      {winner.place === 3 && <span className="winner-medal bronze">🥉</span>}
                      {winner.place > 3 && <span className="winner-rank">#{winner.place}</span>}
                    </div>
                    <div className="winner-info">
                      <div className="winner-user">
                        {isCurrentUser ? 'Вы' : `Пользователь ${winner.userId}`}
                      </div>
                      <div className="winner-amount">
                        {formatNumber(winner.amount)} ⭐
                      </div>
                    </div>
                    <div className="winner-prize">
                      🎁
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
