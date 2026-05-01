import Lead from "../models/Lead.js";

const leadPopulate = [
  { path: "product", select: "name slug" },
  { path: "assignedTo", select: "fullName email" }
];

const createLead = async (payload) => {
  const lead = await Lead.create(payload);
  return Lead.findById(lead._id).populate(leadPopulate);
};

const getLeads = async (filter, skip, limit) => {
  return Lead.find(filter)
    .populate(leadPopulate)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

const getLeadById = async (id) => {
  return Lead.findById(id).populate(leadPopulate);
};

const updateLeadStatus = async (id, status) => {
  const updateData = { status };

  if (status === "contacted") {
    updateData.contactedAt = new Date();
  }

  if (status === "converted") {
    updateData.convertedAt = new Date();
  }

  if (status === "spam") {
    updateData.isSpam = true;
  }

  return Lead.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  }).populate(leadPopulate);
};

const addLeadNote = async (id, note) => {
  return Lead.findByIdAndUpdate(
    id,
    { $push: { notes: note } },
    { new: true, runValidators: true }
  ).populate(leadPopulate);
};

export { createLead, getLeads, getLeadById, updateLeadStatus, addLeadNote };
