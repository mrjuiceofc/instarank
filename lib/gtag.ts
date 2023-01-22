export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

type EventGA = {
  action: string;
  category: string;
  label: string;
  value: number;
};

export const pageview = (url: string) => {
  if (!window || !(window as any).gtag || !GA_TRACKING_ID) return;

  (window as any).gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }: EventGA) => {
  if (!window || !(window as any).gtag || !GA_TRACKING_ID) return;

  (window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const conversion = (id: string) => {
  if (!window || !(window as any).gtag || !GA_TRACKING_ID) return;

  (window as any).gtag('event', 'conversion', {
    send_to: id,
  });
};
