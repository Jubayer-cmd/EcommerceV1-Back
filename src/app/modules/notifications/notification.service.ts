import { PrismaClient, Notification } from '@prisma/client';

const prisma = new PrismaClient();

const sendNotification = async (data: Notification): Promise<Notification> => {
  const newNotification = await prisma.notification.create({
    data,
  });
  return newNotification;
};

const sendNotificationToAllUsers = async (data: Notification): Promise<any> => {
  const users = await prisma.user.findMany({
    where: {
      role: 'user',
    },
  });

  const notifications = users.map((user) => ({
    ...data,
    userId: user.id,
  }));

  const newNotifications = await prisma.notification.createMany({
    data: notifications,
    skipDuplicates: true,
  });

  return newNotifications;
};

const getUserNotifications = async (userId: string): Promise<any> => {
  const notifications = await prisma.notification.findMany({
    where: { userId },
  });
  return notifications;
};

const deleteAllUserNotifications = async (userId: string): Promise<any> => {
  await prisma.notification.deleteMany({
    where: { userId },
  });
  return 'Notifications deleted successfully';
};

const deleteExcessUserNotifications = async (userId: string): Promise<any> => {
  const userNotificationCount = await prisma.notification.count({
    where: { userId },
  });

  if (userNotificationCount > 20) {
    const notificationsToDelete = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: userNotificationCount - 20,
    });

    const notificationIdsToDelete = notificationsToDelete.map(
      (notification) => notification.id,
    );

    await prisma.notification.deleteMany({
      where: {
        id: { in: notificationIdsToDelete },
      },
    });
  }
  return 'Excess notifications deleted successfully';
};

export const notificationService = {
  sendNotification,
  getUserNotifications,
  deleteAllUserNotifications,
  deleteExcessUserNotifications,
  sendNotificationToAllUsers,
};
