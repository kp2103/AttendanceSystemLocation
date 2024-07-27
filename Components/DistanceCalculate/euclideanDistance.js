function toCartesian(lat, lon) {
    const EARTH_RADIUS = 6371000; // Earth's radius in meters
    const toRadians = (degrees) => degrees * Math.PI / 180;

    const x = EARTH_RADIUS * toRadians(lon) * Math.cos(toRadians(lat));
    const y = EARTH_RADIUS * toRadians(lat) * Math.cos(toRadians(lat));
    return { x, y };
}

export const euclideanDistance = async(centerLat, centerLon, userLat, userLon) => {
    const p1 = toCartesian(centerLat, centerLon);
    const p2 = toCartesian(userLat, userLon);

    const distance = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    return distance;
}