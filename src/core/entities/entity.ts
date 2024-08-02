/* eslint-disable @typescript-eslint/no-explicit-any */
import { UniqueEntityID } from './unique-entity-id';

export abstract class Entity<Props> {
  private _id: UniqueEntityID;
  protected props: Props;

  protected constructor(props: Props, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID();
    this.props = props;
  }

  getId(): string {
    return this._id.getValue();
  }

  equals(entity: Entity<any>): boolean {
    if (entity === this) {
      return true;
    }

    if (entity.getId() === this.getId()) {
      return true;
    }

    return false;
  }
}
