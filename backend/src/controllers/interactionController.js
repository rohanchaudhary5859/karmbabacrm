const Interaction = require('../models/Interaction');

exports.createInteraction = async (req, res) => {
  try {
    const interaction = await Interaction.create(req.body, req.user.id);
    res.status(201).json({
      success: true,
      interaction
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getInteractions = async (req, res) => {
  try {
    const interactions = await Interaction.findAll(req.user.id);
    res.json({
      success: true,
      interactions
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getInteraction = async (req, res) => {
  try {
    const interaction = await Interaction.findById(req.params.id, req.user.id);
    
    if (!interaction) {
      return res.status(404).json({
        success: false,
        message: 'Interaction not found'
      });
    }
    
    res.json({
      success: true,
      interaction
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getClientInteractions = async (req, res) => {
  try {
    const interactions = await Interaction.findByClient(req.params.clientId, req.user.id);
    res.json({
      success: true,
      interactions
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.updateInteraction = async (req, res) => {
  try {
    const interaction = await Interaction.update(req.params.id, req.body, req.user.id);
    
    if (!interaction) {
      return res.status(404).json({
        success: false,
        message: 'Interaction not found'
      });
    }
    
    res.json({
      success: true,
      interaction
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.deleteInteraction = async (req, res) => {
  try {
    const interaction = await Interaction.delete(req.params.id, req.user.id);
    
    if (!interaction) {
      return res.status(404).json({
        success: false,
        message: 'Interaction not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Interaction deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};