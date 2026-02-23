-- ============================================================
-- Water Department Service Portal — Database Schema
-- Urban Water Authority / Water Supply Board
-- ============================================================

-- ── Consumers ────────────────────────────────────────────────
CREATE TABLE consumers (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150)        NOT NULL,
    mobile          VARCHAR(10)         NOT NULL UNIQUE,
    email           VARCHAR(200),
    password_hash   VARCHAR(255),
    otp             VARCHAR(6),
    otp_expires_at  DATETIME,
    is_verified     BOOLEAN             DEFAULT FALSE,
    created_at      DATETIME            DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Properties ───────────────────────────────────────────────
CREATE TABLE properties (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    consumer_id     INT                 NOT NULL,
    property_id     VARCHAR(50)         NOT NULL UNIQUE,
    zone_number     VARCHAR(30),
    ward_number     VARCHAR(30),
    address         TEXT                NOT NULL,
    sub_code        VARCHAR(20),
    bill_number     VARCHAR(50),
    created_at      DATETIME            DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_property_consumer FOREIGN KEY (consumer_id)
        REFERENCES consumers (id) ON DELETE CASCADE
);

-- ── Complaints ───────────────────────────────────────────────
CREATE TABLE complaints (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id    VARCHAR(30)         NOT NULL UNIQUE,   -- e.g. COMP-20260222-0001
    consumer_id     INT,
    property_id     VARCHAR(50),
    mobile          VARCHAR(10)         NOT NULL,
    description     TEXT                NOT NULL,
    status          ENUM(
                        'Submitted',
                        'Under Review',
                        'Assigned',
                        'In Progress',
                        'Resolved',
                        'Closed'
                    )                   DEFAULT 'Submitted',
    assigned_to     VARCHAR(150),       -- field officer name
    resolved_at     DATETIME,
    created_at      DATETIME            DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_complaint_consumer FOREIGN KEY (consumer_id)
        REFERENCES consumers (id) ON DELETE SET NULL
);

-- ── Payments ─────────────────────────────────────────────────
CREATE TABLE payments (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    receipt_no      VARCHAR(30)         NOT NULL UNIQUE,   -- e.g. RCP-20260222-0001
    consumer_id     INT,
    property_id     VARCHAR(50),
    amount          DECIMAL(10, 2)      NOT NULL,
    tax_period      VARCHAR(30),                           -- e.g. 'Jan 2026'
    payment_mode    ENUM('UPI', 'Card', 'Net Banking', 'Cash', 'OTP Pay', 'Quick Pay'),
    payment_status  ENUM('Pending', 'Success', 'Failed', 'Refunded') DEFAULT 'Pending',
    paid_at         DATETIME,
    created_at      DATETIME            DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_consumer FOREIGN KEY (consumer_id)
        REFERENCES consumers (id) ON DELETE SET NULL
);

-- ── Service Applications (New Water Connection) ───────────────
CREATE TABLE service_applications (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    application_no      VARCHAR(30)     NOT NULL UNIQUE,   -- e.g. APP-20260222-0001
    consumer_id         INT,
    property_id         VARCHAR(50),
    applicant_name      VARCHAR(150)    NOT NULL,
    mobile              VARCHAR(10)     NOT NULL,
    email               VARCHAR(200),
    address             TEXT            NOT NULL,
    connection_type     ENUM('Domestic', 'Commercial', 'Industrial') DEFAULT 'Domestic',
    status              ENUM(
                            'Submitted',
                            'Documents Pending',
                            'Under Verification',
                            'Field Inspection',
                            'Approved',
                            'Connection Issued',
                            'Rejected'
                        )               DEFAULT 'Submitted',
    remarks             TEXT,
    inspector_name      VARCHAR(150),
    approved_at         DATETIME,
    created_at          DATETIME        DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_consumer FOREIGN KEY (consumer_id)
        REFERENCES consumers (id) ON DELETE SET NULL
);

-- ── Indexes for common queries ────────────────────────────────
CREATE INDEX idx_complaints_mobile         ON complaints (mobile);
CREATE INDEX idx_complaints_status         ON complaints (status);
CREATE INDEX idx_payments_property         ON payments (property_id);
CREATE INDEX idx_service_apps_status       ON service_applications (status);
CREATE INDEX idx_consumers_mobile          ON consumers (mobile);
CREATE INDEX idx_properties_consumer       ON properties (consumer_id);
