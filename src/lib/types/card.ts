export interface CardProps {
    title: string;
    introduction: string;
    imageUrl: string;
    author: string;
    article_type: string;
    category: {
        id: number;
        name: string;
    } | string;
    publish_date: string;
    submit_date: string;
    id: number;
    slug?: string;
    style: string;
    isDashboard: boolean;
    isModerator: boolean;
    isAdmin: boolean;
    status: string;
    imgStyle: string;
    carouselClasses: boolean
}