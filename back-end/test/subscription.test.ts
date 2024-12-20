import { Subscription } from '../model/subscription'; // Assuming Subscription class is in the same directory

test('given: valid subscription data, when: subscription is created, then: subscription properties are set correctly', () => {
    // given
    const subscription = new Subscription({
        id: 1,
        region: 'North America',
        subtype: 'Premium',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-01-01'),
        orderId: '98765',
    });

    // when

    // then
    expect(subscription.getId()).toEqual(1);
    expect(subscription.getRegion()).toEqual('North America');
    expect(subscription.getSubtype()).toEqual('Premium');
    expect(subscription.getStartDate()).toEqual(new Date('2024-01-01'));
    expect(subscription.getEndDate()).toEqual(new Date('2025-01-01'));
    expect(subscription.getOrderId()).toEqual('98765');
});

test('given: missing optional createdAt and updatedAt, when: subscription is created, then: these properties are undefined', () => {
    // given
    const subscription = new Subscription({
        id: 1,
        region: 'Europe',
        subtype: 'Basic',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-01-01'),
        orderId: '12345',
    });

    // when

    // then
    expect(subscription.getCreatedAt()).toBeUndefined();
    expect(subscription.getUpdatedAt()).toBeUndefined();
});

test('given: invalid subscription data, when: missing region, then: throws error', () => {
    // given
    const invalidSubscriptionData = () => new Subscription({
        id: 1,
        region: '',
        subtype: 'Standard',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-01-01'),
        orderId: '12345',
    });

    // when & then
    expect(invalidSubscriptionData).toThrow('Region is required');
});

test('given: invalid subscription data, when: missing subtype, then: throws error', () => {
    // given
    const invalidSubscriptionData = () => new Subscription({
        id: 1,
        region: 'North America',
        subtype: '',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-01-01'),
        orderId: '12345',
    });

    // when & then
    expect(invalidSubscriptionData).toThrow('Subtype is required');
});

test('given: invalid subscription data, when: invalid startDate, then: throws error', () => {
    // given
    const invalidSubscriptionData = () => new Subscription({
        id: 1,
        region: 'North America',
        subtype: 'Premium',
        startDate: <any> '',
        endDate: new Date('2025-01-01'),
        orderId: '12345',
    });

    // when & then
    expect(invalidSubscriptionData).toThrow('StartDate must be a valid date');
});

test('given: invalid subscription data, when: invalid endDate, then: throws error', () => {
    // given
    const invalidSubscriptionData = () => new Subscription({
        id: 1,
        region: 'North America',
        subtype: 'Premium',
        startDate: new Date('2024-01-01'),
        endDate: <any> '',
        orderId: '12345',
    });

    // when & then
    expect(invalidSubscriptionData).toThrow('EndDate must be a valid date');
});


test('given: two different subscriptions, when: comparing subscriptions, then: they are not equal', () => {
    // given
    const subscription1 = new Subscription({
        id: 1,
        region: 'North America',
        subtype: 'Premium',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-01-01'),
        orderId: '98765',
    });

    const subscription2 = new Subscription({
        id: 2,
        region: 'Europe',
        subtype: 'Basic',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-01-01'),
        orderId: '54321',
    });

    // when

    // then
    expect(subscription1.equals(subscription2)).toBe(false);
});
