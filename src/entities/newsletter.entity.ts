export interface NewsletterEntity {
    id: string;
    name: string;
    linkUrl: string;
    imgSrc: string;
    active: boolean;
}

export const NEWSLETTER_TABLE = 'newsletter';
