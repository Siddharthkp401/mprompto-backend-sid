import { Notification } from '../models'

const createNotificationService = async (body) => {
    return await Notification.create(body)

}

const getAllNotificationOfUser = async () => {
    return await Notification.find({ user_id: req.user._id })
}

const sendNotification = async () => {
    // send notification to user
}

export default  {
    createNotificationService,
    getAllNotificationOfUser,
    sendNotification
}