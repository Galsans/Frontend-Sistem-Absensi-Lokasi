import { useState, useEffect, useCallback, useRef } from "react";
import axiosClient from "./api";

export default function CursorPaginate({ endpoint, renderItem, pageSize = 10 }) {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchInput, setSearchInput] = useState(""); // untuk input field
  const [searchTerm, setSearchTerm] = useState(""); // untuk trigger pencarian
  const [notFound, setNotFound] = useState(false);

  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);
  const loaderRef = useRef(null);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const fetchData = useCallback(
    async (cursorParam = null, searchValue = "") => {
      if (loadingRef.current || (!hasMoreRef.current && cursorParam !== null)) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const params = { limit: pageSize };
        if (cursorParam) params.cursor = cursorParam;
        if (searchValue) params.search = searchValue;

        const res = await axiosClient.get(endpoint, { params });

        const newItems = res.data.data.data || [];
        const nextCursor = res.data.data.next_cursor || null;

        setItems((prev) => {
          if (searchValue || !cursorParam) {
            return newItems;
          } else {
            const existingIds = new Set(prev.map((item) => item.id));
            const filteredItems = newItems.filter((item) => !existingIds.has(item.id));
            return [...prev, ...filteredItems];
          }
        });

        setCursor(nextCursor);
        setHasMore(Boolean(nextCursor));
        setNotFound(newItems.length === 0 && !cursorParam);
      } catch (err) {
        console.error("Kesalahan Mengambil Data:", err);
        setError("Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    },
    [endpoint, pageSize]
  );

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = () => {
    if (loading) return;

    const trimmedInput = searchInput.trim();
    const trimmedSearch = searchTerm.trim();

    // Jika input sama dan hasil sudah ada, jangan lakukan apa-apa
    if (trimmedInput === trimmedSearch && items.length > 0) return;

    setSearchTerm(trimmedInput);
    setItems([]);
    setCursor(null);
    setHasMore(true);

    // Reset notFound hanya jika keyword berubah
    if (trimmedInput !== trimmedSearch) {
      setNotFound(false);
    }

    setError(null);
  };

  const resetSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setItems([]);
    setCursor(null);
    setHasMore(true);
    setNotFound(false);
    setError(null);
  };

  useEffect(() => {
    fetchData(null, searchTerm);
  }, [endpoint, fetchData, searchTerm]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading && searchTerm === "") {
          fetchData(cursor);
        }
      },
      { rootMargin: "200px" }
    );

    const currentRef = loaderRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchData, cursor, hasMore, loading, searchTerm]);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 md:px-8 font-sans">
      <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-6">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchInputChange}
          placeholder="Cari..."
          className="flex-1 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none px-4 py-2 rounded-lg transition-all duration-200 shadow-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearchSubmit();
            }
          }}
        />
        <button onClick={handleSearchSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md">
          Cari
        </button>
        {searchTerm && (
          <button onClick={resetSearch} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all duration-200 shadow-md">
            Reset
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
          <strong className="font-bold">Kesalahan!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {items.map((item) => (
          <li key={item.id}>{renderItem(item)}</li>
        ))}
      </ul>

      {notFound && !loading && (
        <div className="text-center text-gray-500 mt-8 py-4 px-6 bg-gray-50 rounded-lg shadow-inner">
          <p className="text-lg font-medium">Data tidak ditemukan.</p>
          <p className="text-sm mt-1">Coba istilah pencarian yang berbeda atau atur ulang pencarian.</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-6 text-blue-600 font-semibold flex items-center justify-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Memuat data...</span>
        </div>
      )}

      {hasMore && !loading && searchTerm === "" && <div ref={loaderRef} className="h-1 w-full" />}
    </div>
  );
}
