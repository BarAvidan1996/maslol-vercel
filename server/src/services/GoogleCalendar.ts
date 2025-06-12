import { google } from 'googleapis';
import { AppointmentType } from '../types';

function getDateTime(date: Date, time: string): string {
  // date is Date object, time is string (e.g. '14:00:00')
  const d = new Date(date);
  const [hours, minutes, seconds] = time.split(':');
  d.setHours(Number(hours), Number(minutes), Number(seconds) || 0, 0);
  return d.toISOString();
}

export class GoogleCalendarService {
  private calendar: any;

  constructor(credentials: any) {
    const auth = new google.auth.OAuth2(
      '959566793019-l4dccpie0ep60cb9tc6ihj2sp.tom2ct.apps.googleusercontent.com',
      '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',
      'http://isgonnbe.mtacloud.co.il/api/google/callback'
    );
    this.calendar = google.calendar({ version: 'v3', auth });
  }

  async createAppointment(appointment: AppointmentType): Promise<string> {
    try {
      const startDateTime = getDateTime(appointment.date, appointment.time);
      // For demo, set end time +1 hour
      const endDate = new Date(startDateTime);
      endDate.setHours(endDate.getHours() + 1);
      const endDateTime = endDate.toISOString();

      const event = {
        summary: `Rehabilitation Session - ${appointment.type}`,
        location: appointment.location,
        description: appointment.notes,
        start: {
          dateTime: startDateTime,
          timeZone: 'Asia/Jerusalem',
        },
        end: {
          dateTime: endDateTime,
          timeZone: 'Asia/Jerusalem',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: this.getReminderMinutes(appointment.reminderTime) },
            { method: 'popup', minutes: 10 },
          ],
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      return response.data.id;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  private getReminderMinutes(reminderTime: AppointmentType['reminderTime']): number {
    switch (reminderTime) {
      case '30min':
        return 30;
      case '1hour':
        return 60;
      case '1day':
        return 1440;
      default:
        return 60;
    }
  }

  async updateAppointment(
    eventId: string,
    appointment: AppointmentType
  ): Promise<void> {
    try {
      const startDateTime = getDateTime(appointment.date, appointment.time);
      const endDate = new Date(startDateTime);
      endDate.setHours(endDate.getHours() + 1);
      const endDateTime = endDate.toISOString();

      const event = {
        summary: `Rehabilitation Session - ${appointment.type}`,
        location: appointment.location,
        description: appointment.notes,
        start: {
          dateTime: startDateTime,
          timeZone: 'Asia/Jerusalem',
        },
        end: {
          dateTime: endDateTime,
          timeZone: 'Asia/Jerusalem',
        },
      };

      await this.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: event,
      });
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  async deleteAppointment(eventId: string): Promise<void> {
    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }
}

export function getOAuth2Client() {
  return new google.auth.OAuth2(
    '959566793019-l4dccpie0ep60cb9tc6ihj2sp.tom2ct.apps.googleusercontent.com',
    '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',
    'http://isgonnbe.mtacloud.co.il/api/google/callback'
  );
}
