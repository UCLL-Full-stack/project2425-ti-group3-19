import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header';
import Select from 'react-select';

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
        if (!token) {
            router.push('/login');
        }
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

    const handleAddOrUpdateOrder = () => {
        if (
            (selectedOption === 'Ticket' && (!beginStation || !endStation)) ||
            (selectedOption === 'Subscription' && (!subscriptionLength || !region)) ||
            (selectedOption === '10-Session Card' && !region)
        ) {
            setErrorMessage('Please fill out all required fields.');
            setSuccessMessage('');
            return;
        }

        const orderData = {
            id: currentOrderId ?? orderList.length + 1,
            product: selectedOption,
            orderDate: new Date().toISOString(),
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

    const handleEditOrder = (orderId) => {
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

    const handleRemoveOrder = (orderId) => {
        setOrderList(orderList.filter(order => order.id !== orderId));
    };

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h2>Buy Tickets and Subscriptions</h2>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <div className="mb-3">
                    <label htmlFor="ticketOption" className="form-label">Select an Option:</label>
                    <select
                        id="ticketOption"
                        className="form-select"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                    >
                        <option value="Ticket">Single Ticket</option>
                        <option value="Subscription">Subscription</option>
                        <option value="10-Session Card">10-Session Card</option>
                    </select>
                </div>

                {selectedOption === 'Ticket' && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="beginStation" className="form-label">Begin Station:</label>
                            <Select
                                id="beginStation"
                                options={stations}
                                value={beginStation}
                                onChange={(option) => setBeginStation(option)}
                                placeholder="Select start station"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="endStation" className="form-label">End Station:</label>
                            <Select
                                id="endStation"
                                options={stations}
                                value={endStation}
                                onChange={(option) => setEndStation(option)}
                                placeholder="Select destination station"
                            />
                        </div>
                    </>
                )}

                {selectedOption === 'Subscription' && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="subscriptionLength" className="form-label">Subscription Length:</label>
                            <select
                                id="subscriptionLength"
                                className="form-select"
                                value={subscriptionLength}
                                onChange={(e) => setSubscriptionLength(e.target.value)}
                            >
                                <option value="1 Month">1 Month</option>
                                <option value="3 Months">3 Months</option>
                                <option value="6 Months">6 Months</option>
                                <option value="12 Months">12 Months</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="region" className="form-label">Region:</label>
                            <Select
                                id="region"
                                options={regions}
                                value={region}
                                onChange={(option) => setRegion(option)}
                                placeholder="Select region"
                            />
                        </div>
                    </>
                )}

                {selectedOption === '10-Session Card' && (
                    <div className="mb-3">
                        <label htmlFor="region" className="form-label">Region:</label>
                        <Select
                            id="region"
                            options={regions}
                            value={region}
                            onChange={(option) => setRegion(option)}
                            placeholder="Select region"
                        />
                    </div>
                )}

                <button className="btn btn-primary" onClick={handleAddOrUpdateOrder}>
                    {isEditing ? 'Update Order' : `Add ${selectedOption} to List`}
                </button>

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
                                <td>{order.orderDate}</td>
                                <td>{order.price}</td>
                                <td>{order.region || 'N/A'}</td>
                                <td>{order.beginStation || 'N/A'}</td>
                                <td>{order.endStation || 'N/A'}</td>
                                <td>{order.subscriptionLength || 'N/A'}</td>
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
