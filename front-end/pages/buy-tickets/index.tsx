import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header';
import Select from 'react-select';
import {getUserIdFromToken} from '@/services/jwtdecode';

export default function BuyTickets() {
    const [selectedOption, setSelectedOption] = useState('Ticket');
    const [subscriptionLength, setSubscriptionLength] = useState('1 Month');
    const [region, setRegion] = useState<{ value: string; label: string } | null>(null);
    const [beginStation, setBeginStation] = useState<{ value: string; label: string } | null>(null);
    const [endStation, setEndStation] = useState<{ value: string; label: string } | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [orderList, setOrderList] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);

    const regions = [
        { value: 'north', label: 'North' },
        { value: 'south', label: 'South' },
        { value: 'east', label: 'East' },
        { value: 'west', label: 'West' },
    ];

    const stations = [
        { value: 'station1', label: 'Station 1' },
        { value: 'station2', label: 'Station 2' },
        { value: 'station3', label: 'Station 3' },
        { value: 'station4', label: 'Station 4' },
    ];
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setToken(token);
        console.log('Token in buy tickets:', token);
        if (!token) {
            router.push('/login');
        }
        const id = getUserIdFromToken(token as string);
        setUserId(id);
    }, [router]);


    const resetForm = () => {
        setSelectedOption('Ticket');
        setSubscriptionLength('1 Month');
        setRegion(null);
        setBeginStation(null);
        setEndStation(null);
        setIsEditing(false);
        setCurrentOrderId(null);
    };

    const fetchUserOrders = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/user-orders?userId=${userId}`, {
                method: 'GET',
                headers: {  
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const orders = await response.json();
            return orders;
        } catch (error) {
            console.error("Error fetching user orders:", error);
            return [];
        }
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
        console.log('User ID in frontend buy tickets:', userId);

        const orders = await fetchUserOrders();
        console.log('Orders in frontend buy tickets:', orders);
        let matching = false;

        if (selectedOption === 'Subscription') {
            console.log('subscription');
            const hasMatchingSubscription = async () => {
                for (const order of orders) {
                    if (order.product === 'Subscription') {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/${order.orderReferentie}`);
                        if (response.ok) {
                            const subscription = await response.json();
                            console.log('Subscription:', subscription);
                            console.log('Region:', subscription.region);
                            if (subscription.region === region?.label) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }; 

            matching = await hasMatchingSubscription();
            console.log('Matching:', matching);
            if (matching) {
                setErrorMessage('You already have a subscription for this region.');
                return;
            }
        }

        const orderDate = new Date(); // This will create a Date object (not a string)
        const orderData = {
            id: currentOrderId ?? orderList.length + 1,
            product: selectedOption,
            orderDate: orderDate.toISOString(),
            price: 50,
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

    const handlePurchase = async () => {
        if (orderList.length === 0) {
            setErrorMessage('Please add at least one item before purchasing.');
            setSuccessMessage('');
            return;
        }

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ orders: orderList }),
            });

            if (response.ok) {
                setSuccessMessage('Order successfully placed!');
                setOrderList([]); // Clear the list after successful purchase
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Failed to place order.');
            }
        } catch (error) {
            setErrorMessage('An error occurred while placing the order.');
        }
    };


    return (
        <>
            <Header />
            <div className="container mt-5">
                <h2>Buy Tickets and Subscriptions</h2>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                {/* Selection Form */}
                <div>
                    <label>Product Type</label>
                    <select
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="form-select"
                    >
                        <option value="Ticket">Ticket</option>
                        <option value="Subscription">Subscription</option>
                        <option value="10-Session Card">10-Session Card</option>
                    </select>

                    {selectedOption === 'Subscription' && (
                        <div>
                            <label>Subscription Length</label>
                            <select
                                value={subscriptionLength}
                                onChange={(e) => setSubscriptionLength(e.target.value)}
                                className="form-select"
                            >
                                <option value="1 Month">1 Month</option>
                                <option value="3 Months">3 Months</option>
                                <option value="6 Months">6 Months</option>
                                <option value="1 Year">1 Year</option>
                            </select>
                        </div>
                    )}

                    {['Subscription', '10-Session Card'].includes(selectedOption) && (
                        <div>
                            <label>Region</label>
                            <Select
                                options={regions}
                                value={region}
                                onChange={setRegion}
                                placeholder="Select Region"
                            />
                        </div>
                    )}

                    {selectedOption === 'Ticket' && (
                        <>
                            <div>
                                <label>Begin Station</label>
                                <Select
                                    options={stations}
                                    value={beginStation}
                                    onChange={setBeginStation}
                                    placeholder="Select Begin Station"
                                />
                            </div>
                            <div>
                                <label>End Station</label>
                                <Select
                                    options={stations}
                                    value={endStation}
                                    onChange={setEndStation}
                                    placeholder="Select End Station"
                                />
                            </div>
                        </>
                    )}

                    <button className="btn btn-primary mt-3" onClick={handleAddOrUpdateOrder}>
                        {isEditing ? 'Update Order' : `Add ${selectedOption} to List`}
                    </button>

                    <button className="btn btn-success mt-3 ms-2" onClick={handlePurchase}>
                        Buy All Products
                    </button>
                </div>

                <table className="table mt-4">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product</th>
                        <th>Order Date</th>
                        <th>Price</th>
                        <th>Region</th>
                        <th>Begin Station</th>
                        <th>End Station</th>
                        <th>Subscription Length</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderList.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.product}</td>
                            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td>${order.price}</td>
                            <td>{order.region}</td>
                            <td>{order.beginStation}</td>
                            <td>{order.endStation}</td>
                            <td>{order.subscriptionLength}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditOrder(order.id)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleRemoveOrder(order.id)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
