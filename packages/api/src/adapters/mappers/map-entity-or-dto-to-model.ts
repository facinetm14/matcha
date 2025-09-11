export function isUpperCase(char: string): boolean {
  return char === char.toUpperCase() && char !== char.toLowerCase();
}

export function mapEnityOrDtoToModel<E extends Record<string, unknown>, M>(
  entity: E,
): M {
  const model: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(entity)) {
    const potentialModelKey = [...key]
      .map((char) => (isUpperCase(char) ? `_${char.toLowerCase()}` : char))
      .join('');

    model[potentialModelKey] = value;
  }

  return model as M;
}
