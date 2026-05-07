function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function toIso(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Next-night pair in ISO (YYYY-MM-DD) for reservation query strings. */
export function defaultStayDates(): { checkin: string; checkout: string } {
  const checkin = new Date();
  checkin.setDate(checkin.getDate() + 1);
  const checkout = new Date(checkin);
  checkout.setDate(checkout.getDate() + 1);
  return { checkin: toIso(checkin), checkout: toIso(checkout) };
}

/** Multi-night stay well in the future (ISO) — fewer clashes on shared demo. */
export function journeyStayDates(): { checkin: string; checkout: string } {
  const checkin = new Date();
  checkin.setDate(checkin.getDate() + 45);
  const checkout = new Date(checkin);
  checkout.setDate(checkout.getDate() + 2);
  return { checkin: toIso(checkin), checkout: toIso(checkout) };
}

export function uniqueContactName(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

/** First name for booking APIs (demo enforces length 3–18). */
export function uniqueGuestFirstName(tag: string): string {
  const id = String(Date.now()).slice(-8);
  const combined = `${tag}${id}`.replace(/[^a-zA-Z0-9]/g, '');
  return combined.slice(0, 18);
}
