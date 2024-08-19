export class ValueObject<Props> {
  protected props: Props;

  constructor(props: Props) {
    this.props = props;
  }

  equals(valueObject: ValueObject<unknown>): boolean {
    if (!valueObject) return false;
    if (valueObject.props === undefined) return false;

    return JSON.stringify(this.props) === JSON.stringify(valueObject.props);
  }
}
