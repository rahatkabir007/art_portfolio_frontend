export { };

declare global {
    interface Window {
        fbq: (abc: string, def: string, obj: {
            currency: string
            value: number
        }) => void;
        smartlook
    }
}