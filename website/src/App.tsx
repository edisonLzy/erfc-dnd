import { useCallback, useState } from 'react';
import Card from './components/Card';
import './index.css';
const style = {
  width: '200px',
};
function App() {
  const [cards, setCards] = useState([
    { id: 'card1', text: '卡片1' },
    { id: 'card2', text: '卡片2' },
    { id: 'card3', text: '卡片3' },
  ]);
  const handleMoveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const cloneCards = [...cards];
      [cloneCards[hoverIndex], cloneCards[dragIndex]] = [
        cloneCards[dragIndex],
        cloneCards[hoverIndex],
      ];
      setCards(cloneCards);
    },
    [cards]
  );
  return (
    <div className="App" style={style}>
      {cards.map((card, index) => (
        <Card
          id={card.id}
          index={index}
          key={card.id}
          text={card.text}
          moveCard={handleMoveCard}
        />
      ))}
    </div>
  );
}

export default App;
