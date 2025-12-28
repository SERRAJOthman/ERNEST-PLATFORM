"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextService = void 0;
// Defined Zones (Mock Geofences)
const ZONES = {
    FOUNDATION: { lat: 34.0522, lng: -118.2437, radius: 0.0005 }, // ~50m
    ROOF: { lat: 34.0525, lng: -118.2440, radius: 0.0005 }
};
class ContextService {
    /**
     * Determines the UI Mode based on sensor input.
     * @param accel - raw accelerometer data
     * @param location - raw GPS data
     */
    determineContext(accel, location) {
        // 1. Safety Check: If moving too fast/erratically (Fall Detection / Heavy movement)
        const totalForce = Math.sqrt(accel.x ** 2 + accel.y ** 2 + accel.z ** 2);
        if (totalForce > 2.5) { // Threshold > 2.5g (simulated heavy movement)
            console.log(`[Context] Heavy movement detected (${totalForce.toFixed(2)}g). Triggering Safety Warning.`);
            return 'SAFETY_WARNING';
        }
        // 2. Activity Check: "Lifting" or "Carrying" -> Voice Mode
        // Simplified: If phone is not stable (moving moderately)
        if (totalForce > 1.2 && totalForce <= 2.5) {
            console.log(`[Context] Moderate activity (${totalForce.toFixed(2)}g). Switching to VOICE_HANDS_FREE.`);
            return 'VOICE_HANDS_FREE';
        }
        // 3. Location Check: Specific Zone -> Specific Tool
        if (this.isInZone(location, ZONES.FOUNDATION)) {
            console.log('[Context] Location: Foundation Zone. Switching to PLAN_VIEW (Foundation Drawings).');
            return 'PLAN_VIEW';
        }
        // Default
        return 'STANDARD';
    }
    isInZone(userLoc, zone) {
        // Simple Euclidean distance for mock (not Haversine for performance/simplicity here)
        const dist = Math.sqrt((userLoc.latitude - zone.lat) ** 2 +
            (userLoc.longitude - zone.lng) ** 2);
        return dist < zone.radius;
    }
}
exports.ContextService = ContextService;
