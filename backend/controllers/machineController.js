const asyncHandler = require('express-async-handler');
const Machine = require('../models/machine');

//@desc Get all machines
//@route GET /api/machine
//@access Private
const getMachines = asyncHandler(async (req, res) => {
    const machines = await Machine.find({})
    .populate('ownerId', 'name address')
    .populate('img');

    res.json(machines);
});

//@desc Get machine by ID
//@route GET /api/machine/
//@access Private
const getMachine = asyncHandler(async (req, res) => {
    const { machineId } = req.query;
    const machine = await Machine.findById(machineId)
        .populate('ownerId', 'name address city state zipCode mobile')
        .populate('img')
        .populate('reviews', 'rating comment userId')
        .populate('reviews.userId', 'name');
    if (machine) {
        res.status(200).json({ message: "Success", machine });
    } else {
        res.status(404);
        throw new Error('Machine not found');
    }
});

//@desc Register machine
//@route POST /api/machine
//@access Public
const createMachine = asyncHandler(async (req, res) => {
    console.log(" create machine ");
    const formData = req.body;
    const ownerId = req.user.id;
    // Only users with role 'owner' can create machines
    if (!req.user || req.user.role !== 'owner') {
        return res.status(403).json({ message: 'Only owners can create machines' });
    }
    console.log(ownerId);
    console.log(formData);
    const machine = new Machine({
        ...formData, ownerId
    });
    machine.save().then(machine => {
        res.status(201).json({ message: 'Machine created', machine });
    }).catch(err => {
        console.log(err);
    });
});

//@desc Update machine
//@route PUT /api/machine/
//@access Public
const updateMachine = asyncHandler(async (req, res) => {
    const { machineId, name, company, description, availability, rentalPrice } = req.body;
    const machine = await Machine.findById(machineId);
    if (machine) {
        machine.name = name;
        machine.company = company;
        machine.description = description;
        machine.availability = availability;
        machine.rentalPrice = rentalPrice;
        machine.ownerId = ownerId;
        machine.img = img;
        machine.condition = condition;
        machine.reviews = reviews;
        machine.save().then(machine => {
            res.status(201).json({ message: 'Machine updated', machine });
        }).catch(err => {
            console.log(err);
        });
    } else {
        res.status(404);
        throw new Error('Machine not found');
    }
});

//@desc Delete machine
//@route DELETE /api/machine/
//@access Public
const deleteMachine = asyncHandler(async (req, res) => {
    const { machineId } = req.body;
    const machine = await Machine.findById(machineId);
    if (machine) {
        machine.deleteOne().then(() => {
            res.status(200).json({ message: 'Machine deleted' });
        }).catch(err => {
            console.log(err);
        });
    } else {
        res.status(404);
        throw new Error('Machine not found');
    }
});

//@desc Get machines by owner
//@route GET /api/machine/owner/:ownerId
//@access Private
const getMachinesByOwner = asyncHandler(async (req, res) => {
    try {
        const machines = await Machine.find({ ownerId: req.params.ownerId })
            .populate('ownerId', 'name address')
            .populate('img');

        res.status(200).json(machines);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch machines by owner' });
    }
});

module.exports = {
    getMachines,
    getMachine,
    createMachine,
    updateMachine,
    deleteMachine,
    getMachinesByOwner
};
