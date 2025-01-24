export interface ITransactionManager {
  transaction<T>(callback: (tx: unknown) => Promise<T>): Promise<T>;
}
