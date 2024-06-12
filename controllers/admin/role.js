const { default: mongoose } = require("mongoose");
const Role = require("../../models/role");
const { successResponse, errorResponse } = require("../../helper/helper");

exports.createRole = async (req, res) => {
  const data = req.body;

  await Role.create({ ...data })
    .then((response) => {
      successResponse(res, { data: response }, "Role create successfully");
    })
    .catch((err) => {
      errorResponse(res, {}, "Role not created yet. Please try again later");
    });
};

exports.getRoles = async (req, res) => {
  await Role.aggregate([
    {
      $sort: { createdAt: -1 },
    },
  ])
    .then((response) =>
      successResponse(res, { roles: response }, "Role fetch successfully")
    )
    .catch((err) =>
      errorResponse(res, {}, "Role not fetch yet. Please try again later")
    );
};

exports.getRoleById = async (req, res) => {
  const id = req.params.id;

  await Role.findOne({ _id: id })
    .then((response) =>
      successResponse(res, { role: response }, "Role fetch successfully")
    )
    .catch((err) =>
      errorResponse(res, {}, "Role not fetch yet. Please try again later")
    );
};

exports.getRoleIdByName = async (name) => {
  try {
    let resp = await Role.findOne({ name: name });
    if (resp) {
      return { status: true, data: resp };
    }
  } catch (err) {
    return { status: false, data: null };
  }
};
