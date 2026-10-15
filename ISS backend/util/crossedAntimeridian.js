function crossedAntimeridian(
    previousPoint,
    currentPoint
) {

    const deltaLng = Math.abs(
        currentPoint.longitude -
        previousPoint.longitude
    );

    return deltaLng > 180;
}

module.exports = crossedAntimeridian;