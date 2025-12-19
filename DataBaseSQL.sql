CREATE TABLE [projects] (
  [project_id] int PRIMARY KEY IDENTITY(1, 1),
  [project_name] nvarchar(255),
  [city] nvarchar(255),
  [governorate] nvarchar(255),
  [description] text,
  [delivery_date] date,
  [project_status] nvarchar(255),
  [created_at] datetime
)
GO

CREATE TABLE [buildings] (
  [building_id] int PRIMARY KEY IDENTITY(1, 1),
  [project_id] int,
  [building_number] int,
  [number_of_floors] int,
  [total_units] int,
  [notes] text
)
GO

CREATE TABLE [units] (
  [unit_id] int PRIMARY KEY IDENTITY(1, 1),
  [building_id] int,
  [unit_number] int,
  [floor_number] int,
  [area_sqm] decimal,
  [unit_type] nvarchar(255),
  [finishing_status] nvarchar(255),
  [base_price] decimal,
  [final_price] decimal,
  [availability_status] nvarchar(255)
)
GO

CREATE TABLE [payment_plans] (
  [payment_plan_id] int PRIMARY KEY IDENTITY(1, 1),
  [unit_id] int,
  [down_payment_percentage] decimal,
  [down_payment_amount] decimal,
  [installment_years] int,
  [installment_amount] decimal,
  [interest_rate] decimal,
  [total_price] decimal
)
GO

CREATE TABLE [eligibility_rules] (
  [eligibility_id] int PRIMARY KEY IDENTITY(1, 1),
  [project_id] int,
  [min_age] int,
  [max_age] int,
  [min_income] decimal,
  [max_income] decimal,
  [marital_status] nvarchar(255),
  [notes] text
)
GO

CREATE TABLE [required_documents] (
  [document_id] int PRIMARY KEY IDENTITY(1, 1),
  [project_id] int,
  [document_name] nvarchar(255),
  [is_mandatory] boolean
)
GO

CREATE TABLE [citizens] (
  [citizen_id] int PRIMARY KEY IDENTITY(1, 1),
  [national_id] nvarchar(255),
  [full_name] nvarchar(255),
  [phone] nvarchar(255),
  [email] nvarchar(255),
  [password_hash] nvarchar(255),
  [birth_date] date,
  [marital_status] nvarchar(255),
  [income] decimal,
  [address] text,
  [created_at] datetime
)
GO

CREATE TABLE [employees] (
  [employee_id] int PRIMARY KEY IDENTITY(1, 1),
  [full_name] nvarchar(255),
  [job_title] nvarchar(255),
  [department] nvarchar(255),
  [email] nvarchar(255),
  [password_hash] nvarchar(255),
  [role] nvarchar(255),
  [created_at] datetime
)
GO

CREATE TABLE [applications] (
  [application_id] int PRIMARY KEY IDENTITY(1, 1),
  [citizen_id] int,
  [unit_id] int,
  [project_id] int,
  [application_date] datetime,
  [application_status] nvarchar(255),
  [reviewed_by] int,
  [review_date] datetime,
  [notes] text
)
GO

CREATE TABLE [application_documents] (
  [app_document_id] int PRIMARY KEY IDENTITY(1, 1),
  [application_id] int,
  [document_id] int,
  [file_path] nvarchar(255),
  [upload_date] datetime,
  [verification_status] nvarchar(255)
)
GO

CREATE TABLE [application_status_history] (
  [status_id] int PRIMARY KEY IDENTITY(1, 1),
  [application_id] int,
  [status] nvarchar(255),
  [changed_at] datetime,
  [changed_by] int
)
GO

CREATE TABLE [notifications] (
  [notification_id] int PRIMARY KEY IDENTITY(1, 1),
  [citizen_id] int,
  [application_id] int,
  [message] text,
  [is_read] boolean,
  [created_at] datetime
)
GO

CREATE TABLE [unit_allocations] (
  [allocation_id] int PRIMARY KEY IDENTITY(1, 1),
  [unit_id] int,
  [citizen_id] int,
  [allocation_date] datetime,
  [contract_status] nvarchar(255)
)
GO

CREATE TABLE [admin_logs] (
  [log_id] int PRIMARY KEY IDENTITY(1, 1),
  [employee_id] int,
  [action] text,
  [action_date] datetime
)
GO

ALTER TABLE [buildings] ADD FOREIGN KEY ([project_id]) REFERENCES [projects] ([project_id])
GO

ALTER TABLE [units] ADD FOREIGN KEY ([building_id]) REFERENCES [buildings] ([building_id])
GO

ALTER TABLE [payment_plans] ADD FOREIGN KEY ([unit_id]) REFERENCES [units] ([unit_id])
GO

ALTER TABLE [eligibility_rules] ADD FOREIGN KEY ([project_id]) REFERENCES [projects] ([project_id])
GO

ALTER TABLE [required_documents] ADD FOREIGN KEY ([project_id]) REFERENCES [projects] ([project_id])
GO

ALTER TABLE [applications] ADD FOREIGN KEY ([citizen_id]) REFERENCES [citizens] ([citizen_id])
GO

ALTER TABLE [applications] ADD FOREIGN KEY ([unit_id]) REFERENCES [units] ([unit_id])
GO

ALTER TABLE [applications] ADD FOREIGN KEY ([project_id]) REFERENCES [projects] ([project_id])
GO

ALTER TABLE [applications] ADD FOREIGN KEY ([reviewed_by]) REFERENCES [employees] ([employee_id])
GO

ALTER TABLE [application_documents] ADD FOREIGN KEY ([application_id]) REFERENCES [applications] ([application_id])
GO

ALTER TABLE [application_documents] ADD FOREIGN KEY ([document_id]) REFERENCES [required_documents] ([document_id])
GO

ALTER TABLE [application_status_history] ADD FOREIGN KEY ([application_id]) REFERENCES [applications] ([application_id])
GO

ALTER TABLE [application_status_history] ADD FOREIGN KEY ([changed_by]) REFERENCES [employees] ([employee_id])
GO

ALTER TABLE [notifications] ADD FOREIGN KEY ([citizen_id]) REFERENCES [citizens] ([citizen_id])
GO

ALTER TABLE [notifications] ADD FOREIGN KEY ([application_id]) REFERENCES [applications] ([application_id])
GO

ALTER TABLE [unit_allocations] ADD FOREIGN KEY ([unit_id]) REFERENCES [units] ([unit_id])
GO

ALTER TABLE [unit_allocations] ADD FOREIGN KEY ([citizen_id]) REFERENCES [citizens] ([citizen_id])
GO

ALTER TABLE [admin_logs] ADD FOREIGN KEY ([employee_id]) REFERENCES [employees] ([employee_id])
GO
