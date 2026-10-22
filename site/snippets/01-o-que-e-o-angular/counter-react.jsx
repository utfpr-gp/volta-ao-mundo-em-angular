import { useState } from 'react';

export function Counter() {
  const [total, setTotal] = useState(0); // [!code highlight]

  return (
    <button onClick={() => setTotal(total + 1)}>
      Cliques: {total}
    </button>
  );
}
