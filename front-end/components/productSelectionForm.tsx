import Select from 'react-select';

interface ProductSelectionFormProps {
    selectedOption: string;
    setSelectedOption: (option: string) => void;
    subscriptionLength: string;
    setSubscriptionLength: (length: string) => void;
    region: { value: string; label: string } | null;
    setRegion: (region: { value: string; label: string } | null) => void;
    beginStation: { value: string; label: string } | null;
    setBeginStation: (station: { value: string; label: string } | null) => void;
    endStation: { value: string; label: string } | null;
    setEndStation: (station: { value: string; label: string } | null) => void;
    handleAddOrUpdateOrder: () => void;
    isEditing: boolean;
}

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

const ProductSelectionForm = ({
    selectedOption,
    setSelectedOption,
    subscriptionLength,
    setSubscriptionLength,
    region,
    setRegion,
    beginStation,
    setBeginStation,
    endStation,
    setEndStation,
    handleAddOrUpdateOrder,
    isEditing,
}: ProductSelectionFormProps) => (
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
    </div>
);

export default ProductSelectionForm;
