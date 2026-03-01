import { getFullProfileService } from './profile.service.js';

export async function getFullProfile(req, res, next) {
    try {
        const { mobile } = req.params;
        const data = await getFullProfileService(mobile);
        res.json(data);
    } catch (err) {
        next(err);
    }
}
