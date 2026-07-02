import { getAttachmentContent } from "./util.js";
import { MailServiceContract } from "./contracts/mail.contract.js";
import { ResendMailAdapterImpl } from "./adapters/resend.adapter.js";

const mailProvider: MailServiceContract = new ResendMailAdapterImpl();

export const MailService = {
  sendMail: mailProvider.sendMail.bind(mailProvider),
  getAttachmentContent,
};

export default MailService;