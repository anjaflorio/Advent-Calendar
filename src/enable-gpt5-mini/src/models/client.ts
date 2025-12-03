class Client {
    id: string;
    name: string;
    email: string;
    features: Record<string, boolean>;

    constructor(id: string, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.features = {};
    }

    enableFeature(feature: string): void {
        this.features[feature] = true;
    }

    disableFeature(feature: string): void {
        this.features[feature] = false;
    }

    isFeatureEnabled(feature: string): boolean {
        return this.features[feature] || false;
    }

    getClientData(): { id: string; name: string; email: string; features: Record<string, boolean> } {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            features: this.features,
        };
    }
}

export default Client;