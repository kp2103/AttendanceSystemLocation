export const equiRectangularDistance = async(centerLat, centerLon, userLat, userLon)=>{
    const R = 6371000; // Radius of the Earth in meters
    const toRadians = (degrees) => degrees * Math.PI / 180;

    const x = toRadians(userLon - centerLon) * Math.cos(toRadians((centerLat + userLat) / 2));
    const y = toRadians(userLat - centerLat);

    // generated by chatgpt
    // const x = toRadians(userLon - centerLon) * Math.cos(toRadians((centerLat + userLat) / 2));
    // const y = toRadians(userLat - centerLat);


    const distance = Math.sqrt(x * x + y * y) * R;
    return distance;
}