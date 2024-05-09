const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const merchantDocumentSchema = new Schema(
  {
    pancardNumber: String,
    entityName: String,
    entityName: String,
    pancardLink: String,
    isGSTRegistered: {
      type: Boolean,
      default: false,
    },
    fssaiNumber: String,
    fssaiExpireDate: String,
    fssaiLink: String,

    bankAccountNumber: String,
    accountType: String,
    bankIFSCCode: String,
    beneficiaryName: String,
    bankcancelCheque: String,

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "merchantDocuments",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
);

const MerchantDocuments = model("merchantDocuments", merchantDocumentSchema);
module.exports = MerchantDocuments;
