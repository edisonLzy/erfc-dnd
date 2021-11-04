import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { CARD } from '../actionType';
const style = {
  backgroundColor: 'red',
  padding: '5px',
  border: '1px dashed gray',
  cursor: 'move',
};
interface Card {
  text: string;
  id: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

function useDragOpacity({
  id,
  index,
  ref,
}: Omit<Card, 'text' | 'moveCard'> & {
  ref: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: CARD,
    item: () => ({ id, index }),
    collect: (monitor) => ({
      //要收集的属性
      isDragging: monitor.isDragging(),
    }),
  });
  drag(ref);
  const opacity = isDragging ? 0.1 : 1;
  return [opacity] as const;
}
function useDropOpacity({
  id,
  index,
  ref,
  moveCard,
}: Omit<Card, 'text'> & {
  ref: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const [, drop] = useDrop<
    Omit<Card, 'text'>,
    Omit<Card, 'text'>,
    Omit<Card, 'text'>
  >({
    accept: CARD,
    hover(item, monitor) {
      //被拖动卡片的索引
      const dragIndex = item.index;
      //hover卡片的索引
      const hoverIndex = index;
      //如果一样什么都不做
      if (dragIndex === hoverIndex) {
        return;
      }
      //获取hover卡片的位置信息
      const { top, bottom } = ref.current!.getBoundingClientRect();
      //获取hover卡片高度的一半
      const halfOfHoverHeight = (bottom - top) / 2;
      //获取鼠标最新的X和Y坐标
      const { y } = monitor.getClientOffset()!;
      const hoverClientY = y - top;
      if (
        (dragIndex < hoverIndex && hoverClientY > halfOfHoverHeight) ||
        (dragIndex > hoverIndex && hoverClientY < halfOfHoverHeight)
      ) {
        moveCard(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
  });
  drop(ref);
}
export default function Card({ text, id, index, moveCard }: Card) {
  const ref = useRef<HTMLDivElement>(null);
  const [opacity] = useDragOpacity({ id, index, ref });
  useDropOpacity({ id, index, ref, moveCard });
  return (
    <div
      style={{
        ...style,
        opacity,
      }}
      ref={ref}
    >
      {text}
    </div>
  );
}
