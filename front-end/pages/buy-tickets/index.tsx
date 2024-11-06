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
    const [order_list, setOrderList] = useState<any[]>([]); // Type to accommodate order entries
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

    const handleAddOrder = () => {
        // Validate fields based on the selected option
        if (
            (selectedOption === 'Ticket' && (!beginStation || !endStation)) ||
            (selectedOption === 'Subscription' && (!subscriptionLength || !region)) ||
            (selectedOption === '10-Session Card' && !region)
        ) {
            setErrorMessage('Please fill out all required fields.');
            setSuccessMessage('');
            return;
        }

        // Define the order data
        const orderData = {
            id: order_list.length + 1, // Unique ID for each order
            product: selectedOption,
            orderDate: new Date().toISOString(),
            price: 50, // Example price
            region: region?.label,
            beginStation: beginStation?.label,
            endStation: endStation?.label,
            subscriptionLength,
        };

        // Add order to list
        setOrderList((prevOrderList) => [...prevOrderList, orderData]);
        setErrorMessage('');
        setSuccessMessage(`${selectedOption} added to list!`);
        console.log(order_list);
    };

    const handlePurchase = async () => {
        try {
            for (const order of order_list) {
                const response = await fetch('/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                    body: JSON.stringify(order),
                });

                if (!response.ok) {
                    throw new Error('Order submission failed');
                }
            }

            setSuccessMessage('All orders submitted successfully!');
            setOrderList([]); // Clear the order list after successful submission
            router.push('/confirmation'); // Redirect to a confirmation page if needed
        } catch (error) {
            setErrorMessage((error as Error).message);
            setSuccessMessage('');
        }
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

                <button className="btn btn-primary" onClick={handleAddOrder}>
                    Add {selectedOption} to List
                </button>
                <button className="btn btn-success" onClick={handlePurchase}>
                    Buy All Orders
                </button>
            </div>
        </>
    );
}
