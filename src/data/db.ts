import {
  SQLiteDatabase,
  enablePromise,
  openDatabase,
} from 'react-native-sqlite-storage';
import Session from '../models/Sessions';
import {differenceInSeconds, format} from 'date-fns';
import Reminder from '../models/Reminder';

const DB_NAME = 'activity-tracking.db';
const SESSIONS_TABLE = 'Sessions';
const REMINDERS_TABLE = 'Reminders';

enablePromise(true);

export const openDBConnection = () =>
  openDatabase({
    name: DB_NAME,
    location: 'default',
  });

export const createSessionsTableIfNotExists = (db: SQLiteDatabase) => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS ${SESSIONS_TABLE} (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        activity TEXT DEFAULT NULL,
        start_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        end_time DATETIME DEFAULT NULL,
        distance REAL DEFAULT 0,
        status TEXT CHECK(status IN ('ongoing', 'completed')) DEFAULT 'ongoing'
      )`,
      [],
      () => console.log('Sessions table created'),
      error => console.log(error),
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS ${REMINDERS_TABLE} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          time TEXT
        );`,
      [],
      () => console.log('Reminders table created'),
      error => console.log(error),
    );
  });
};

export const startSession = (db: SQLiteDatabase): Promise<number> => {
  return new Promise((resolve, reject) => {
    const startTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO ${SESSIONS_TABLE} (status, start_time) VALUES (?, ?)`,
        ['ongoing', startTime],
        (_, result) => resolve(result.insertId),
        (_, error) => reject(error),
      );
    });
  });
};

export const completeSession = (
  db: SQLiteDatabase,
  sessionId: number,
  activity: string,
  distance: number,
) => {
  const endTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  db.transaction(tx => {
    tx.executeSql(
      `UPDATE ${SESSIONS_TABLE} SET activity = ?, end_time = ?, distance = ?, status = 'completed' WHERE id = ?`,
      [activity, endTime, distance, sessionId],
      () => console.log('Session updated'),
      error => console.log(error),
    );
  });
};

export const fetchSessions = (
  db: SQLiteDatabase,
  callback: (sessions: Session[]) => void,
) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM ${SESSIONS_TABLE} ORDER BY start_time DESC`,
      [],
      (_, results) => {
        let sessions: Session[] = [];
        for (let i = 0; i < results.rows.length; i++) {
          const item = results.rows.item(i);
          const startDatetime = new Date(item.start_time);
          const endDatetime = item.end_time
            ? new Date(item.end_time)
            : undefined;
          const session: Session = {
            id: item.id,
            activity: item.activity,
            distance: item.distance,
            status: item.status,
            startDate: startDatetime,
            endDate: endDatetime,
            duration: endDatetime
              ? differenceInSeconds(endDatetime, startDatetime)
              : 0,
          };
          sessions.push(session);
        }
        callback(sessions);
      },
      err => console.error(err),
    );
  });
};

export const fetchSessionSummary = (
  db: SQLiteDatabase,
  callback: (summary: {
    totalDuration: number;
    totalDistance: number;
    totalCalories: number;
  }) => void,
) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT 
          SUM(
            CASE 
              WHEN end_time IS NOT NULL THEN (strftime('%s', end_time) - strftime('%s', start_time))
              ELSE 0 
            END
          ) AS totalDuration,
          SUM(distance) AS totalDistance,
          SUM(
            CASE 
              WHEN activity = 'running' THEN (distance / 1000) * 60
              WHEN activity = 'walking' THEN (distance / 1000) * 50
              ELSE 0 
            END
          ) AS totalCalories
        FROM ${SESSIONS_TABLE} 
        WHERE status = 'completed'`,
      [],
      (_, results) => {
        const row = results.rows.item(0);
        const summary = {
          totalDuration: row.totalDuration || 0,
          totalDistance: row.totalDistance || 0,
          totalCalories: row.totalCalories || 0,
        };
        callback(summary);
      },
      error => console.log(error),
    );
  });
};

// Reminders
export const getReminders = (
  db: SQLiteDatabase,
  callback: (reminders: Reminder[]) => void,
) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM ${REMINDERS_TABLE};`,
      [],
      (_, results) => callback(results.rows.raw()),
      (_, error) => console.log('Error fetching reminders:', error),
    );
  });
};

export const addReminder = (
  db: SQLiteDatabase,
  name: string,
  datetime: Date,
  callback: (id: number) => void,
) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO ${REMINDERS_TABLE} (name, time) VALUES (?, ?);`,
      [name, format(datetime, 'HH:mm')],
      (_, result) => callback(result.insertId),
      (_, error) => console.log('Error inserting reminder:', error),
    );
  });
};

export const deleteReminder = (db: SQLiteDatabase, id: number) => {
  db.transaction(tx => {
    tx.executeSql(
      `DELETE FROM ${REMINDERS_TABLE} WHERE id = ?;`,
      [id],
      (_, result) => console.log('Reminder deleted:', result),
      (_, error) => console.log('Error deleting reminder:', error),
    );
  });
};
