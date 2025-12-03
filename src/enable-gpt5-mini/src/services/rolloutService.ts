class RolloutService {
    private featureFlags: Record<string, boolean>;

    constructor(featureFlags: Record<string, boolean>) {
        this.featureFlags = featureFlags;
    }

    enableFeature(feature: string): void {
        this.featureFlags[feature] = true;
    }

    disableFeature(feature: string): void {
        this.featureFlags[feature] = false;
    }

    isFeatureEnabled(feature: string): boolean {
        return this.featureFlags[feature] || false;
    }

    getAllFeatures(): Record<string, boolean> {
        return this.featureFlags;
    }
}

export default RolloutService;