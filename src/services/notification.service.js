import { Notification } from '../models';

const createNotificationService = async (body) => {
  return Notification.create(body);
};

const getAllNotificationOfUser = async (userId) => {
  return Notification.find({ user_id: userId });
};

const sendNotification = async () => {
  // send notification to user
};

export default {
  createNotificationService,
  getAllNotificationOfUser,
  sendNotification,
};
