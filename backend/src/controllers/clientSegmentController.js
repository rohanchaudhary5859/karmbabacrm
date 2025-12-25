const ClientSegment = require('../models/ClientSegment');

exports.createSegment = async (req, res) => {
  try {
    const segment = await ClientSegment.create(req.body, req.user.id);
    res.status(201).json({
      success: true,
      segment
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getSegments = async (req, res) => {
  try {
    const segments = await ClientSegment.findAll(req.user.id);
    res.json({
      success: true,
      segments
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getSegment = async (req, res) => {
  try {
    const segment = await ClientSegment.findById(req.params.id, req.user.id);
    
    if (!segment) {
      return res.status(404).json({
        success: false,
        message: 'Segment not found'
      });
    }
    
    res.json({
      success: true,
      segment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.updateSegment = async (req, res) => {
  try {
    const segment = await ClientSegment.update(req.params.id, req.body, req.user.id);
    
    if (!segment) {
      return res.status(404).json({
        success: false,
        message: 'Segment not found'
      });
    }
    
    res.json({
      success: true,
      segment
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.deleteSegment = async (req, res) => {
  try {
    const segment = await ClientSegment.delete(req.params.id, req.user.id);
    
    if (!segment) {
      return res.status(404).json({
        success: false,
        message: 'Segment not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Segment deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.addClientToSegment = async (req, res) => {
  try {
    const { segmentId, clientId } = req.body;
    const segment = await ClientSegment.addClient(segmentId, clientId, req.user.id);
    
    res.json({
      success: true,
      segment
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.removeClientFromSegment = async (req, res) => {
  try {
    const { segmentId, clientId } = req.body;
    const segment = await ClientSegment.removeClient(segmentId, clientId, req.user.id);
    
    res.json({
      success: true,
      segment
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};