import { Plus } from "lucide-react";

export default function Button({ onClick }) {
  return (
    <button onClick={onClick} className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300" aria-label="Add">
      <Plus className="w-6 h-6" />
    </button>
  );
}
