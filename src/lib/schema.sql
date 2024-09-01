CREATE TABLE
  user_session (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT NOT NULL,
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP,
    user_agent TEXT,
    referrer TEXT,
    session_duration INTEGER,
    page_count INTEGER DEFAULT 0,
    bot_probability REAL,
    request_frequency REAL
  );

CREATE TABLE
  page_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    slug TEXT NOT NULL,
    pageviews INTEGER DEFAULT 0,
    visits INTEGER DEFAULT 0,
    uniques INTEGER DEFAULT 0,
    avg_duration REAL,
    bounce_rate REAL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bot_visits INTEGER DEFAULT 0
  );

CREATE TABLE
  page_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    slug TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    load_time INTEGER,
    request_type TEXT CHECK (
      request_type IN ('initial', 'subsequent', 'resource')
    ),
    content_type TEXT,
    request_order INTEGER,
    time_since_last_request INTEGER
  );

CREATE TABLE
  request_headers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    header_name TEXT NOT NULL,
    header_value TEXT NOT NULL
  );

CREATE TABLE
  bot_fingerprints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    fingerprint_type TEXT NOT NULL,
    fingerprint_value TEXT NOT NULL
  );

CREATE TABLE
  honeypot_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    honeypot_type TEXT NOT NULL,
    interaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT
  );

CREATE TABLE
  rate_limiting_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    request_count INTEGER,
    time_window INTEGER
  );

CREATE TABLE
  content_access_patterns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    access_pattern TEXT NOT NULL,
    frequency INTEGER,
    last_observed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  behavioural_anomalies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    anomaly_type TEXT NOT NULL,
    details TEXT,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );