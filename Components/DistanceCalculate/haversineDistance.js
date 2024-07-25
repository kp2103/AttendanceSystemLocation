export const haversineDistance = async(centerLat, centerLon, userLat, userLon)=>{
    const R = 6371000; // Radius of the Earth in meters
    const toRadians = (degrees) => degrees * Math.PI / 180;
    
    const phi1 = toRadians(centerLat);
    const phi2 = toRadians(centerLon);
    const deltaPhi = toRadians(userLat - centerLat);
    const deltaLambda = toRadians(userLon - centerLon);
    
    const a = Math.sin(deltaPhi / 2) ** 2 +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    const distance = R * c;
    return distance;
}