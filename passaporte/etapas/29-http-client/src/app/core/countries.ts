/** O clima de cada capital, com a temperatura média do ano, arredondada. */
export const CLIMATES: Record<string, { kind: string; average: number }> = {
  BR: { kind: 'Tropical de savana', average: 21 },
  JP: { kind: 'Subtropical úmido', average: 16 },
  PT: { kind: 'Mediterrâneo', average: 17 },
  IT: { kind: 'Mediterrâneo', average: 16 },
  AR: { kind: 'Subtropical úmido', average: 18 },
  CA: { kind: 'Continental úmido', average: 6 },
};
