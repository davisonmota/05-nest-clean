export class Slug {
  private readonly _value: string;

  constructor(value: string) {
    this._value = value;
  }

  static createFromText(value: string): Slug {
    const slugText = value
      .normalize('NFKD')
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w]+/g, '-')
      .replace(/_/g, '-')
      .replace(/--/g, '-')
      .replace(/-$/g, '');

    return new Slug(slugText);
  }

  getValue(): string {
    return this._value;
  }
}
