export abstract class HashComparator {
  abstract compare(pain: string, hash: string): Promise<boolean>;
}
