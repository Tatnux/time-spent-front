export interface IIteration {
  id: string;
  startDate: string;
  dueDate: string;
  state: 'all' | 'closed' | 'current' | 'opened' | 'upcoming';
  iterationCadence: IIterationCadence;
}

export interface IIterationCadence {
  title: string;
}
