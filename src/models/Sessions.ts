export default interface Session {
  id: number;
  activity: string;
  duration: number;
  distance: number;
  status?: string;
  startDate: Date;
  endDate?: Date;
}
