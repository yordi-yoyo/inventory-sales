export function formatCurrency(amount) {
    return `${Number(amount).toLocaleString('en-ET', { minimumFractionDigits: 2 })} Br`;
}