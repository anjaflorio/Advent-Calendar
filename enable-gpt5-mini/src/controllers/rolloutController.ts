class RolloutController {
    constructor(private rolloutService: RolloutService) {}

    async enableFeature(req: Request, res: Response): Promise<void> {
        const clientId = req.params.clientId;
        try {
            await this.rolloutService.enableFeatureForClient(clientId);
            res.status(200).json({ message: 'Feature enabled successfully.' });
        } catch (error) {
            res.status(500).json({ message: 'Error enabling feature.', error: error.message });
        }
    }

    async disableFeature(req: Request, res: Response): Promise<void> {
        const clientId = req.params.clientId;
        try {
            await this.rolloutService.disableFeatureForClient(clientId);
            res.status(200).json({ message: 'Feature disabled successfully.' });
        } catch (error) {
            res.status(500).json({ message: 'Error disabling feature.', error: error.message });
        }
    }

    async getFeatureStatus(req: Request, res: Response): Promise<void> {
        const clientId = req.params.clientId;
        try {
            const status = await this.rolloutService.getFeatureStatusForClient(clientId);
            res.status(200).json({ status });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving feature status.', error: error.message });
        }
    }
}

export default RolloutController;