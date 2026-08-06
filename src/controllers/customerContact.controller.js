const customerContactService = require("../services/customerContact.service");

const createContact = async (req, res) => {
  try {
    const contact = await customerContactService.createContact(
      req.body,
      req.user
    );

    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: contact,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getContacts = async (req, res) => {
  try {
    const result = await customerContactService.getContacts(req.query, req.user);

    res.status(200).json({
      success: true,
      message: "Contacts fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getContact = async (req, res) => {
  try {
    const contact = await customerContactService.getContactById(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Contact fetched successfully",
      data: contact,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getCustomerContacts = async (req, res) => {
  try {
    const result = await customerContactService.getCustomerContacts(
      req.params.customerId,
      req.query,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Contacts fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateContact = async (req, res) => {
  try {
    const contact = await customerContactService.updateContact(
      req.params.id,
      req.body,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: contact,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteContact = async (req, res) => {
  try {
    await customerContactService.deleteContact(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createContact,
  getContacts,
  getContact,
  getCustomerContacts,
  updateContact,
  deleteContact,
};
