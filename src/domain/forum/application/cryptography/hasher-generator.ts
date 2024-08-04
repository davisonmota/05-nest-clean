export abstract class HashGenerator {
  abstract hash(pain: string): Promise<string>;
}
