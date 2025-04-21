import { ListHeaderProps } from './types';

export default function ListHeader({ title, addButtonText, onAddItem }: ListHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-3">
      <h1 className="text-lg font-bold text-gray-900 ml-2">{title}</h1>
      <button onClick={onAddItem} className="btn1">
        {addButtonText}
      </button>
    </div>
  );
}