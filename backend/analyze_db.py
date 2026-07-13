import sqlite3
import pandas as pd

def analyze_db():
    try:
        conn = sqlite3.connect('database/gigafactory_live.db')
        
        # Get tables
        tables = conn.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall()
        print(f"Tables in Database: {[t[0] for t in tables]}")
        
        if tables:
            for t in tables:
                t_name = t[0]
                
                # Get total rows
                count = conn.execute(f"SELECT COUNT(*) FROM {t_name};").fetchone()[0]
                
                # Get column names and sample data
                df = pd.read_sql_query(f"SELECT * FROM {t_name} LIMIT 5", conn)
                
                print(f"\n--- {t_name} Table Analysis ---")
                print(f"Total Rows: {count:,}")
                print(f"Total Columns: {len(df.columns)}")
                print(f"Column Names: {list(df.columns)}\n")
                
                print("First 5 Rows Sample:")
                print(df.head().to_string())
                
                # Column data types and missing data check (sample)
                print("\nData Types and Summary (Over a slice of 1000 limit):")
                df_sample = pd.read_sql_query(f"SELECT * FROM {t_name} LIMIT 1000", conn)
                print(df_sample.describe().to_string())
                
        conn.close()
    except Exception as e:
        print(f"Error occurred: {e}")

if __name__ == "__main__":
    analyze_db()
