export interface ClientData {
    id: string;
    name: string;
    email: string;
    features: FeatureFlag[];
}

export interface FeatureFlag {
    name: string;
    enabled: boolean;
    description?: string;
}