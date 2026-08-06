const mongoose = require("mongoose");
const Meeting = require("../models/Meeting");
const Customer = require("../models/Customer");
const Deal = require("../models/Deal");
const Lead = require("../models/Lead");
const {
  paginate,
  buildSearchFilter,
  buildSort,
} = require("../utils/query.helpers");

const MEETING_TYPES = ["in_person", "phone", "video"];
const SORTABLE_FIELDS = [
  "createdAt",
  "updatedAt",
  "title",
  "meetingDate",
  "duration",
  "status",
];

const assertValidMeetingId = (meetingId) => {
  if (!mongoose.Types.ObjectId.isValid(meetingId)) {
    const error = new Error("Meeting not found");
    error.status = 404;
    throw error;
  }
};

const assertEntityInCompany = async (Model, id, companyId, notFoundMessage) => {
  if (!id) {
    return null;
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(notFoundMessage);
    error.status = 404;
    throw error;
  }

  const doc = await Model.findOne({ _id: id, company: companyId, isDeleted: false });

  if (!doc) {
    const error = new Error(notFoundMessage);
    error.status = 404;
    throw error;
  }

  return doc;
};

const assertFutureMeetingDate = (meetingDate) => {
  if (!meetingDate) {
    throw new Error("Meeting date is required");
  }

  const date = new Date(meetingDate);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Meeting date must be a valid date");
  }

  if (date.getTime() < Date.now()) {
    throw new Error("Meeting date must be in the future");
  }

  return date;
};

const validateDuration = (duration) => {
  if (duration !== undefined && (typeof duration !== "number" || duration <= 0)) {
    throw new Error("Duration must be greater than zero");
  }
};

const validateMeetingType = (meetingType) => {
  if (meetingType === undefined) {
    return "in_person";
  }

  if (!MEETING_TYPES.includes(meetingType)) {
    throw new Error("Meeting type must be one of: in_person, phone, video");
  }

  return meetingType;
};

const assertCanUpdate = (meeting, user) => {
  if (user.role === "sales" && String(meeting.organizer) !== String(user._id)) {
    const error = new Error("You can only update meetings you organized");
    error.status = 403;
    throw error;
  }
};

const createMeeting = async (meetingData, user) => {
  const {
    title,
    description,
    location,
    meetingLink,
    notes,
    customer,
    deal,
    lead,
    meetingDate,
    duration,
    meetingType,
  } = meetingData;

  if (!title || !title.trim()) {
    throw new Error("Title is required");
  }

  if (!customer) {
    throw new Error("Customer is required");
  }

  const date = assertFutureMeetingDate(meetingDate);
  validateDuration(duration);
  const type = validateMeetingType(meetingType);

  await assertEntityInCompany(Customer, customer, user.company, "Customer not found");
  await assertEntityInCompany(Deal, deal, user.company, "Deal not found");
  await assertEntityInCompany(Lead, lead, user.company, "Lead not found");

  const meeting = await Meeting.create({
    title,
    description,
    location,
    meetingLink,
    notes,
    customer,
    deal: deal || null,
    meetingDate: date,
    duration: duration === undefined ? 60 : duration,
    meetingType: type,
    status: "scheduled",
    company: user.company,
    organizer: user._id,
  });

  return meeting;
};

const getMeetings = async (query, user) => {
  const { page, limit, skip } = paginate(query);

  const filter = {
    company: user.company,
    isDeleted: false,
  };

  const searchFilter = buildSearchFilter(query.search, [
    "title",
    "description",
    "location",
  ]);

  if (searchFilter) {
    Object.assign(filter, searchFilter);
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.meetingType) {
    filter.meetingType = query.meetingType;
  }

  if (query.organizer) {
    filter.organizer = query.organizer;
  }

  if (query.customer) {
    filter.customer = query.customer;
  }

  if (query.deal) {
    filter.deal = query.deal;
  }

  const meetingDateFilter = {};

  if (query.meetingDate) {
    meetingDateFilter.$eq = new Date(query.meetingDate);
  }

  if (query.meetingFrom) {
    meetingDateFilter.$gte = new Date(query.meetingFrom);
  }

  if (query.meetingTo) {
    meetingDateFilter.$lte = new Date(query.meetingTo);
  }

  if (Object.keys(meetingDateFilter).length > 0) {
    filter.meetingDate = meetingDateFilter;
  }

  const sort = buildSort(query.sortBy, query.sortOrder, SORTABLE_FIELDS);

  const [meetings, total] = await Promise.all([
    Meeting.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Meeting.countDocuments(filter),
  ]);

  return {
    meetings,
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    },
  };
};

const getMeetingById = async (meetingId, user) => {
  assertValidMeetingId(meetingId);

  const meeting = await Meeting.findOne({
    _id: meetingId,
    company: user.company,
    isDeleted: false,
  });

  if (!meeting) {
    const error = new Error("Meeting not found");
    error.status = 404;
    throw error;
  }

  return meeting;
};

const updateMeeting = async (meetingId, updateData, user) => {
  const meeting = await getMeetingById(meetingId, user);

  assertCanUpdate(meeting, user);

  const { company, organizer, lead, ...editableFields } = updateData;

  if (company || organizer) {
    throw new Error("You cannot change the company or organizer of a meeting");
  }

  if (editableFields.customer !== undefined) {
    await assertEntityInCompany(
      Customer,
      editableFields.customer,
      user.company,
      "Customer not found"
    );
  }

  if (editableFields.deal !== undefined) {
    await assertEntityInCompany(
      Deal,
      editableFields.deal,
      user.company,
      "Deal not found"
    );
  }

  if (lead !== undefined) {
    await assertEntityInCompany(Lead, lead, user.company, "Lead not found");
  }

  if (editableFields.meetingDate) {
    editableFields.meetingDate = assertFutureMeetingDate(
      editableFields.meetingDate
    );
  }

  if (editableFields.duration !== undefined) {
    validateDuration(editableFields.duration);
  }

  if (editableFields.meetingType !== undefined) {
    editableFields.meetingType = validateMeetingType(
      editableFields.meetingType
    );
  }

  meeting.set(editableFields);
  await meeting.save();

  return meeting;
};

const completeMeeting = async (meetingId, user) => {
  const meeting = await getMeetingById(meetingId, user);

  meeting.status = "completed";
  await meeting.save();

  return meeting;
};

const cancelMeeting = async (meetingId, user) => {
  const meeting = await getMeetingById(meetingId, user);

  assertCanUpdate(meeting, user);

  meeting.status = "cancelled";
  await meeting.save();

  return meeting;
};

const deleteMeeting = async (meetingId, user) => {
  const meeting = await getMeetingById(meetingId, user);

  meeting.isDeleted = true;
  await meeting.save();

  return meeting;
};

module.exports = {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  completeMeeting,
  cancelMeeting,
  deleteMeeting,
};
