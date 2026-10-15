const Orbit = require('../models/OrbitSchema');
const crossedAntimeridian = require('../util/crossedAntimeridian');

async function getNextOrbitNumber() {
    const lastOrbit = await Orbit
        .findOne()
        .sort({ orbitNumber: -1 });

    return lastOrbit ? lastOrbit.orbitNumber + 1 : 1;
};

async function savePosition(position) {
    let activeOrbit = await Orbit.findOne({
        active: true
    });

    if (!activeOrbit) {
        const orbitNumber = await getNextOrbitNumber();
        activeOrbit = await Orbit.create({
            orbitNumber,
            active: true,
            points: []
        });
    }

    const lastPoint = activeOrbit.points[activeOrbit.points.length - 1];
    const isSamePosition =
        lastPoint &&
        Math.abs(lastPoint.latitude - position.latitude) < 0.000001 &&
        Math.abs(lastPoint.longitude - position.longitude) < 0.000001;

    if (isSamePosition) return activeOrbit;

    if (
        lastPoint &&
        crossedAntimeridian(
            lastPoint,
            position
        )
    ) {
        activeOrbit.active = false;
        activeOrbit.endedAt = new Date();
        activeOrbit.antimeridianCrossing = true;

        await activeOrbit.save();
        console.log('CRUZAMENTO DETECTADO');

        const orbitNumber =
            await getNextOrbitNumber();
        const newOrbit =
            await Orbit.create({
                orbitNumber,
                active: true,
                startedAt: new Date(),
                points: [position],
                totalPoints: 1
            });
        return newOrbit;
    }

    activeOrbit.points.push(position);
    activeOrbit.totalPoints += 1;
    await activeOrbit.save();

    return activeOrbit
}

async function getAllOrbits() {

    const orbits = await Orbit
        .find()
        .sort({ orbitNumber: 1 });

    return orbits;
};

async function getActiveOrbit() {

    const activeOrbit = await Orbit.findOne({
        active: true
    });

    return activeOrbit;
};

async function deleteAllOrbits() {
    const result = await Orbit.deleteMany({});
    return result;
};

module.exports = {
    savePosition,
    getNextOrbitNumber,
    getAllOrbits,
    getActiveOrbit,
    deleteAllOrbits
};