interface PromoCodeFormProps {
    promoCode: string;
    setPromoCode: (code: string) => void;
    validatePromoCode: () => void;
    promoCodeMessage: string;
}

const PromoCodeForm = ({ promoCode, setPromoCode, validatePromoCode, promoCodeMessage }: PromoCodeFormProps) => (
    <div className="mt-3">
        <label htmlFor="promoCode">Promo Code (Add promo code first)</label>
        <input
            type="text"
            id="promoCode"
            className="form-control"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.trim())}
        />
        <button
            className="btn btn-primary mt-2"
            onClick={validatePromoCode}
            disabled={!promoCode}
        >
            Apply Promo Code
        </button>
        {promoCodeMessage && <div className="mt-2">{promoCodeMessage}</div>}
    </div>
);

export default PromoCodeForm;
