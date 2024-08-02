import { randomUUID } from 'crypto';

export class UniqueEntityID {
  private _value: string;

  constructor(value?: string) {
    this._value = value ?? randomUUID();
  }

  getValue(): string {
    return this._value;
  }

  equals(id: UniqueEntityID): boolean {
    return id.getValue() === this._value;
  }
}
