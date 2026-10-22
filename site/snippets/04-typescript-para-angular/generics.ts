const codes: Array<string> = ['BR', 'JP'];

function first<T>(items: T[]): T | undefined {
  return items[0];
}

const firstCode = first(codes); // string | undefined
