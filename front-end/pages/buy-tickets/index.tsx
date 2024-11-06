// pages/buy-tickets.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header';
import Select from 'react-select';

export default function BuyTickets() {
    const [selectedOption, setSelectedOption] = useState('Ticket');
    const [subscriptionLength, setSubscriptionLength] = useState('1 Month');
    const [region, setRegion] = useState(null);
    const [beginStation, setBeginStation] = useState(null);
    const [endStation, setEndStation] = useState(null);
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

    const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
    };

    const handlePurchase = () => {
        if (selectedOption === 'Ticket') {
            alert(`Purchased: ${selectedOption}\nFrom: ${beginStation}\nTo: ${endStation}`);
        } else if (selectedOption === 'Subscription') {
            alert(`Purchased: ${selectedOption}\nLength: ${subscriptionLength}\nRegion: ${region}`);
        } else if (selectedOption === '10-Session Card') {
            alert(`Purchased: ${selectedOption}\nRegion: ${region}`);
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h2>Buy Tickets and Subscriptions</h2>
                <div className="mb-3">
                    <label htmlFor="ticketOption" className="form-label">Select an Option:</label>
                    <select
                        id="ticketOption"
                        className="form-select"
                        value={selectedOption}
                        onChange={handleSelectionChange}
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
                                onChange={(selectedOption) => setBeginStation(selectedOption)}
                                placeholder="Select start station"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="endStation" className="form-label">End Station:</label>
                            <Select
                                id="endStation"
                                options={stations}
                                value={endStation}
                                onChange={(selectedOption) => setEndStation(selectedOption)}
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
                                onChange={(selectedOption) => setRegion(selectedOption)}
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
                            onChange={(selectedOption) => setRegion(selectedOption)}
                            placeholder="Select region"
                        />
                    </div>
                )}

                <button className="btn btn-success" onClick={handlePurchase}>
                    Buy {selectedOption}
                </button>
            </div>
        </>
    );
}
