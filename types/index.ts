export interface Feature {
    id: string;
    icon: string;
    title: string;
    text: string;
    longDescription: string;
}

export interface Plan {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    buttonText: string;
    isPopular: boolean;
}

export interface FAQ {
    q: string;
    a: string;
}

export interface ComparisonRow {
    feature: string;
    competitors: (boolean | 'partial')[];
}

export interface ComparisonData {
    headers: string[];
    rows: ComparisonRow[];
}
