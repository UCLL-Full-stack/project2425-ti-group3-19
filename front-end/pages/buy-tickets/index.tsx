import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header';
import { getUserIdFromToken } from '@/services/jwtdecode';
import OrdersService from '@/services/OrderService';
import SubscriptionService from '@/services/SubscriptionService';
import ProductSelectionForm from '@/components/productSelectionForm';
import PromoCodeForm from '@/components/promoCodeForm';
import OrderTable from '@/components/orderTable';
import AlertMessage from '@/components/alerts/alertMessage';

export default function BuyTickets() {
    const [selectedOption, setSelectedOption] = useState('Ticket');
    const [subscriptionLength, setSubscriptionLength] = useState('1 Month');
    const [region, setRegion] = useState<{ value: string; label: string } | null>(null);
    const [beginStation, setBeginStation] = useState<{ value: string; label: string } | null>(null);
    const [endStation, setEndStation] = useState<{ value: string; label: string } | null>(null);
    const [promoCode, setPromoCode] = useState('');
    const [promoCodeDiscount, setPromoCodeDiscount] = useState<number | null>(null);
    const [promoCodeMessage, setPromoCodeMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [orderList, setOrderList] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setToken(token);
        if (!token) {
            router.push('/login');
        }
        const id = getUserIdFromToken(token as string);
        setUserId(id);
    }, [router]);

    const validatePromoCode = async () => {
        if (!promoCode.trim()) {
            setPromoCodeMessage('Promo code cannot be empty.');
            return;
        }

        try {
            const result = await OrdersService.validatePromoCode({ promoCode, token: token as string });
            setPromoCodeDiscount(result.discount);
            setPromoCodeMessage(`Promo code applied! Discount: ${result.discount}%`);
        } catch (error) {
            setPromoCodeMessage((error as Error).message);
            setPromoCodeDiscount(null);
        }
    };

    const resetForm = () => {
        setSelectedOption('Ticket');
        setSubscriptionLength('1 Month');
        setRegion(null);
        setBeginStation(null);
        setEndStation(null);
        setIsEditing(false);
        setCurrentOrderId(null);
    };

    const handleAddOrUpdateOrder = async () => {
        if (
            (selectedOption === 'Ticket' && (!beginStation || !endStation)) ||
            (selectedOption === 'Subscription' && (!subscriptionLength || !region)) ||
            (selectedOption === '10-Session Card' && !region)
        ) {
            setErrorMessage('Please fill out all required fields.');
            setSuccessMessage('');
            return;
        }

        if (!userId || !token) return;

        try {
            const orders = await OrdersService.getUserOrders({ userId, token });

            if (selectedOption === 'Subscription') {
                const hasMatchingSubscription = async () => {
                    for (const order of orders) {
                        if (order.product === 'Subscription') {
                            const subscription = await SubscriptionService.getSubscription({ orderReferentie: order.orderReferentie, token: token as string });
                            if (subscription.region === region?.label) {
                                return true;
                            }
                        }
                    }
                    return false;
                };

                const matching = await hasMatchingSubscription();
                if (matching) {
                    setErrorMessage('You already have a subscription for this region.');
                    return;
                }
            }

            const discountedPrice = promoCodeDiscount
                ? 50 - (50 * promoCodeDiscount / 100)
                : 50;

            const orderDate = new Date();
            const orderData = {
                id: currentOrderId ?? orderList.length + 1,
                product: selectedOption,
                orderDate: orderDate.toISOString(),
                price: discountedPrice,
                region: region?.label,
                beginStation: beginStation?.label,
                endStation: endStation?.label,
                subscriptionLength: selectedOption === 'Subscription' ? subscriptionLength : null,
            };

            if (isEditing && currentOrderId !== null) {
                setOrderList(orderList.map(order => order.id === currentOrderId ? orderData : order));
                setSuccessMessage(`${selectedOption} updated successfully!`);
            } else {
                setOrderList([...orderList, orderData]);
                setSuccessMessage(`${selectedOption} added to list!`);
            }

            setErrorMessage('');
            resetForm();
        } catch (error) {
            setErrorMessage((error as Error).message);
        }
    };

    const handlePurchase = async () => {
        if (orderList.length === 0) {
            setErrorMessage('Please add at least one item before purchasing.');
            setSuccessMessage('');
            return;
        }

        if (!token) return;

        try {
            await OrdersService.placeOrder({
                orders: orderList,
                promotionIds: promoCodeDiscount ? [promoCodeDiscount] : [],
                token,
            });

            setSuccessMessage('Order successfully placed!');
            setOrderList([]);
            setPromoCode('');
            setPromoCodeDiscount(null);
            setPromoCodeMessage('');
            resetForm();
        } catch (error) {
            setErrorMessage((error as Error).message);
        }
    };

    const handleEditOrder = (orderId: number) => {
        const order = orderList.find(order => order.id === orderId);
        if (order) {
            setSelectedOption(order.product);
            setRegion(order.region ? { value: order.region.toLowerCase(), label: order.region } : null);
            setBeginStation(order.beginStation ? { value: order.beginStation.toLowerCase(), label: order.beginStation } : null);
            setEndStation(order.endStation ? { value: order.endStation.toLowerCase(), label: order.endStation } : null);
            setSubscriptionLength(order.subscriptionLength || '1 Month');
            setIsEditing(true);
            setCurrentOrderId(order.id);
        }
    };

    const handleRemoveOrder = (orderId: number) => {
        setOrderList(orderList.filter(order => order.id !== orderId));
    };

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h2>Buy Tickets and Subscriptions</h2>
                <AlertMessage message={errorMessage} type="danger" />
                <AlertMessage message={successMessage} type="success" />

                <PromoCodeForm
                    promoCode={promoCode}
                    setPromoCode={setPromoCode}
                    validatePromoCode={validatePromoCode}
                    promoCodeMessage={promoCodeMessage}
                />

                <ProductSelectionForm
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    subscriptionLength={subscriptionLength}
                    setSubscriptionLength={setSubscriptionLength}
                    region={region}
                    setRegion={setRegion}
                    beginStation={beginStation}
                    setBeginStation={setBeginStation}
                    endStation={endStation}
                    setEndStation={setEndStation}
                    handleAddOrUpdateOrder={handleAddOrUpdateOrder}
                    isEditing={isEditing}
                />

                <button className="btn btn-success mt-3 ms-2" onClick={handlePurchase}>
                    Buy All Products
                </button>

                <OrderTable
                    orderList={orderList}
                    handleEditOrder={handleEditOrder}
                    handleRemoveOrder={handleRemoveOrder}
                />
            </div>
        </>
    );
}
