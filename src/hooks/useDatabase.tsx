import {createContext, useContext, useEffect, useState} from 'react';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {createSessionsTableIfNotExists, openDBConnection} from '../data/db';

interface DatabaseContextType {
  db: SQLiteDatabase | null;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined,
);

export const DatabaseProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        const database = await openDBConnection();
        setDb(database);
        createSessionsTableIfNotExists(database);
      } catch (error) {
        console.error('DB Connection Error:', error);
      }
    };
    initDB();
  }, []);

  return (
    <DatabaseContext.Provider value={{db}}>{children}</DatabaseContext.Provider>
  );
};

export const useDatabase = (): SQLiteDatabase | null | undefined => {
  const context = useContext(DatabaseContext);
  return context?.db;
};
