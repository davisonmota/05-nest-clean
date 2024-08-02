import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { describe, expect, it, vi } from 'vitest';
import { DomainEvent } from './domain-event';
import { DomainEvents } from './domain-events';

class CustomAggregateCreated implements DomainEvent {
  ocurredAt: Date;

  constructor(private aggregate: CustomAggregate) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.getAggregateId();
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null);
    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));
    return aggregate;
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callBackSpy = vi.fn();
    DomainEvents.register(callBackSpy, CustomAggregateCreated.name);
    const aggregate = CustomAggregate.create();

    expect(aggregate.getDomainEvents()).toHaveLength(1);

    DomainEvents.dispatchEventsForAggregate(
      new UniqueEntityID(aggregate.getId()),
    );

    expect(callBackSpy).toHaveBeenCalled();
    expect(aggregate.getDomainEvents()).toHaveLength(0);
  });
});
