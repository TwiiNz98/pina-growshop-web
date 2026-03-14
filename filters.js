// ============================================================
// FILTERS MODULE — estado activo de filtros
// ============================================================

let _state = {
  category: 'all',
  brand:    'all',
  query:    ''
};

const _listeners = new Set();

export function getFilters() {
  return { ..._state };
}

export function setFilter(key, value) {
  if (_state[key] === value) return;
  _state[key] = value;
  _notify();
}

export function resetFilters() {
  _state = { category: 'all', brand: 'all', query: '' };
  _notify();
}

export function onFilterChange(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

function _notify() {
  _listeners.forEach(fn => fn({ ..._state }));
}
