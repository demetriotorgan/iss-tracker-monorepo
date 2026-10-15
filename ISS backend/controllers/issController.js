const { savePosition, getAllOrbits, getActiveOrbit, deleteAllOrbits } = require("../services/orbitService");
const mongoose = require('mongoose');

async function createPosition(req,res){
    try {
        const position = req.body;
        const orbit = await savePosition(position);

        return res.status(201).json({
            sucess: true,
            orbitNumber: orbit.orbitNumber,
            totalPoints: orbit.totalPoints
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            sucess:false,
            message: error.message
        });
    }
};

async function getOrbits(req, res) {

    try {

        const orbits = await getAllOrbits();

        return res.status(200).json(orbits);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

async function getCurrentOrbit(req, res) {

    try {

        const orbit = await getActiveOrbit();

        if (!orbit) {
            return res.status(404).json({
                success: false,
                message: 'Nenhuma órbita ativa encontrada'
            });
        }

        return res.status(200).json({
            success: true,
            orbit
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

async function resetOrbits(req, res) {
    try {
        const result = await deleteAllOrbits();

        return res.json({
            success: true,
            message: "Todas as órbitas foram removidas",
            deletedCount: result.deletedCount
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

async function healthCheck(req,res){
    try {
        const status = mongoose.connection.readyState;
        
        return res.status(200).json({
            api:'online',
            mongodb: status === 1 ? 'connected' : 'disconnected',
            readyState: status
        })
    } catch (error) {
        console.error('Erro com a conexão da API',error);
        return res.status(404).json({
            success:false,
            error: error.message
        })
    }
};


module.exports = {
    createPosition,
    getOrbits,
    getCurrentOrbit,
    resetOrbits,
    healthCheck
}
