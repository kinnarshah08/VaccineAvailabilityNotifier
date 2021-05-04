exports.sendSMS = function (phone, pincode, slotDetails, callback) {
  const {
    MSG91_API_KEY,
    MSG91_SENDER_ID,
    DLT_TE_ID,
    SMS_TEMPLATE,
  } = process.env;
  const msg91 = require("@walkover/msg91")(
    String(MSG91_API_KEY),
    String(MSG91_SENDER_ID),
    "4"
  );

  const message = SMS_TEMPLATE.replace("{{pincode}}", pincode).replace(
    "{{centers}}",
    "Slot details sent over email"
  );

  msg91.send(phone, message, String(DLT_TE_ID), function (err, response) {
    callback(err, response);
  });
};
